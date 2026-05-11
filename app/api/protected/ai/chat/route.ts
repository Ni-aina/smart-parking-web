import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import type {
    ChatCompletion,
    ChatCompletionMessageParam,
    ChatCompletionMessageToolCall
} from "groq-sdk/resources/chat/completions";
import { tools } from "@/utils/tools";
import { getParkingLots } from "@/actions/lots.action";
import { supabaseAdmin } from "@/lib/supabase/admin";
import parseUserTime from "@/utils/DateConverstion";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { LotInterface } from "@/types/lot";

const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "openai/gpt-oss-20b";
const MAX_TOOL_ITERATIONS = 10;
const MAX_MESSAGE_COUNT = 40;
const SERIAL_TOOLS = new Set(["confirm_reservation"]);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const MALFORMED_TOOL_RE = /<function=(\w+)(\{[\s\S]*?\})<\/function>/g;

function extractMalformedToolCalls(text: string): ChatCompletionMessageToolCall[] {
    const calls: ChatCompletionMessageToolCall[] = [];
    let match: RegExpExecArray | null;
    MALFORMED_TOOL_RE.lastIndex = 0;
    while ((match = MALFORMED_TOOL_RE.exec(text)) !== null) {
        const name = match[1];
        const rawArgs = match[2];
        try {
            JSON.parse(rawArgs);
            calls.push({
                id: `synthetic_${Date.now()}_${calls.length}`,
                type: "function",
                function: { name, arguments: rawArgs }
            });
        } catch {
            if (process.env.NODE_ENV !== "production") {
                console.warn(`[groq] Malformed args for tool ${name}:`, rawArgs);
            }
        }
    }
    return calls;
}

async function groqCreate(messages: ChatCompletionMessageParam[], model = PRIMARY_MODEL): Promise<ChatCompletion> {
    try {
        return await groq.chat.completions.create({ model, tools, messages, stream: false });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const isToolFailure = message.includes("tool_use_failed") || message.includes("Failed to call a function");
        if (isToolFailure && model !== FALLBACK_MODEL) {
            return groqCreate(messages, FALLBACK_MODEL);
        }
        throw err;
    }
}

async function executeGetParkingLots(args: Parameters<typeof getParkingLots>[0], lat: number, lng: number) {
    const result = await getParkingLots({ location: { latitude: lat, longitude: lng }, ...args });
    return {
        ...result,
        data: result.data.map((lot: LotInterface) => ({
            lotId: lot.id,
            name: lot.name,
            location: lot.location,
            totalSpots: lot.totalSpots,
            pricePerHour: lot.pricePerHour,
            lotType: lot.lotType,
            distance: lot.distance
        }))
    }
}

async function executeGetUserVehicles(driverId: string, args: { plateNumber?: string; make?: string; model?: string } | null) {
    const { plateNumber, make, model } = args ?? {}
    let query = supabaseAdmin
        .from("vehicles")
        .select("id, plate_number, make, model, year, width, length, height")
        .eq("driver_id", driverId);
    if (plateNumber) query = query.ilike("plate_number", `%${plateNumber}%`);
    if (make) query = query.ilike("make", `%${make}%`);
    if (model) query = query.ilike("model", `%${model}%`);
    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
    if (!data || data.length === 0) return { vehicles: [], message: "No matching vehicle found." }
    return { vehicles: data.map(item => ({ ...item, vehicleId: item.id })) }
}

async function executeCheckVehicleFitsLot(
    vehicleId: number,
    lotType: { id: number; vehicleType: string; description: string; maxWidth: number; maxLength: number; maxHeight: number },
    driverId: string
) {
    if (typeof lotType.maxWidth !== "number" || typeof lotType.maxLength !== "number" || typeof lotType.maxHeight !== "number") {
        return { fits: false, reason: "Lot type dimension data is incomplete. Please re-select the parking lot." }
    }
    const { data: vehicle, error } = await supabaseAdmin
        .from("vehicles")
        .select("width, length, height, make, model")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle();
    if (error || !vehicle) throw new Error(`Vehicle not found: ${error?.message}`);
    const issues: string[] = [];
    if (vehicle.width && vehicle.width > lotType.maxWidth) issues.push(`width ${vehicle.width}m exceeds max ${lotType.maxWidth}m`);
    if (vehicle.length && vehicle.length > lotType.maxLength) issues.push(`length ${vehicle.length}m exceeds max ${lotType.maxLength}m`);
    if (vehicle.height && vehicle.height > lotType.maxHeight) issues.push(`height ${vehicle.height}m exceeds max ${lotType.maxHeight}m`);
    const fits = issues.length === 0;
    return {
        fits,
        vehicle: { make: vehicle.make, model: vehicle.model },
        lotType: lotType.vehicleType,
        reason: fits
            ? `${vehicle.make} ${vehicle.model} fits within the ${lotType.vehicleType} lot constraints.`
            : `${vehicle.make} ${vehicle.model} does not fit: ${issues.join(", ")}.`
    }
}

async function executeCheckAvailability(lotId: number, startTime: string, endTime: string) {
    if (!lotId) throw new Error("Lot id is required");
    if (!startTime || !endTime) throw new Error("Start time and end time are required");
    const parsedStartTime = parseUserTime(startTime);
    const parsedEndTime = parseUserTime(endTime);
    const startDateTime = new Date(parsedStartTime);
    const endDateTime = new Date(parsedEndTime);
    if (startDateTime >= endDateTime) throw new Error("Start time must be before end time");
    const [lotResult, reservationsResult] = await Promise.all([
        supabaseAdmin.from("parking_lots").select("total_spots").eq("id", lotId).single(),
        supabaseAdmin
            .from("reservations")
            .select("id")
            .eq("lot_id", lotId)
            .eq("status", "active")
            .or(`and(start_time.lte.${endDateTime.toISOString()},end_time.gte.${startDateTime.toISOString()})`)
    ])
    if (lotResult.error) throw new Error(`Lot fetching error: ${lotResult.error.message}`);
    if (reservationsResult.error) throw new Error(`Reservations fetching error: ${reservationsResult.error.message}`);
    if (!lotResult.data) throw new Error("Lot not found");
    const totalSpots = lotResult.data.total_spots;
    const occupiedSpots = reservationsResult.data?.length ?? 0;
    const availableSpots = totalSpots - occupiedSpots;
    return {
        availableSpots,
        lotId,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        message: availableSpots > 0 ? `${availableSpots} spot(s) available.` : "No spots available for this time range."
    }
}

async function executeConfirmReservation(driverId: string, lotId: number, vehicleId: number, startTime: string, endTime: string) {
    const { data: vehicle, error: isNotMatch } = await supabaseAdmin
        .from("vehicles")
        .select("id")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle();
    if (!vehicle || isNotMatch) throw new Error(`Vehicle not found or access denied, ${isNotMatch?.message}`);
    const parsedStartTime = parseUserTime(startTime);
    const parsedEndTime = parseUserTime(endTime);
    const payload = denormalizeData({
        driverId,
        lotId: String(lotId),
        vehicleId: String(vehicleId),
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        status: "pending"
    })
    const { data: newReservation, error } = await supabaseAdmin.from("reservations").insert([payload]).select();
    if (!newReservation || error) throw new Error(`An error occurred during reservation creation: ${error?.message}`);
    return { success: true, reservation: normalizeData(newReservation) }
}

async function executeToolCall(
    call: ChatCompletionMessageToolCall,
    driverId: string,
    lat: number,
    lng: number
): Promise<ChatCompletionMessageParam & { role: "tool" }> {
    let result: unknown;
    try {
        const args = JSON.parse(call.function.arguments);
        switch (call.function.name) {
            case "get_parking_lots":
                result = await executeGetParkingLots(args, lat, lng);
                break;
            case "get_user_vehicles":
                result = await executeGetUserVehicles(driverId, args);
                break;
            case "check_vehicle_fits_lot":
                result = await executeCheckVehicleFitsLot(args.vehicleId, args.lotType, driverId);
                break;
            case "check_availability":
                result = await executeCheckAvailability(args.lotId, args.startTime, args.endTime);
                break;
            case "confirm_reservation":
                result = await executeConfirmReservation(driverId, args.lotId, args.vehicleId, args.startTime, args.endTime);
                break;
            default:
                result = { error: `Unknown tool: ${call.function.name}` }
        }
    } catch (err) {
        result = { error: err instanceof Error ? err.message : String(err) }
    }
    return { role: "tool", tool_call_id: call.id, content: JSON.stringify(result) }
}

export async function POST(req: NextRequest) {
    try {
        const { messages, driverId, latitude, longitude } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0)
            return Response.json({ error: "Messages array is required" }, { status: 400 });
        if (!driverId || typeof driverId !== "string")
            return Response.json({ error: "driverId is required" }, { status: 400 });
        if (latitude == null || longitude == null)
            return Response.json({ error: "latitude and longitude are required" }, { status: 400 });

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lng))
            return Response.json({ error: "latitude and longitude must be valid numbers" }, { status: 400 });

        const boundedMessages = messages.slice(-MAX_MESSAGE_COUNT) as ChatCompletionMessageParam[];

        const allMessages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are a parking reservation assistant. Follow this strict order:
                    1. find a lot (get_parking_lots)
                    2. find a vehicle (get_user_vehicles)
                    3. check fit (check_vehicle_fits_lot) — pass the full lotType object from the chosen lot
                    4. check availability (check_availability) — ask user for start/end time first
                    5. summarise and ask for confirmation
                    6. only then call confirm_reservation

                    Rules:
                    - Always use the "lotId" / "vehicleId" database fields from tool results — never list positions.
                    - Pass time exactly as the user wrote it; do NOT convert to ISO yourself.
                    - Price is in USD. Be concise and friendly.
                    - Never reveal lat/lng values.
                `
            },
            ...boundedMessages
        ]

        let response = await groqCreate(allMessages);
        let iterations = 0;

        while (true) {
            const choice = response.choices[0];
            let toolCalls = choice.message.tool_calls ?? [];

            if (
                choice.finish_reason !== "tool_calls" &&
                typeof choice.message.content === "string" &&
                choice.message.content.includes("<function=")
            ) {
                const recovered = extractMalformedToolCalls(choice.message.content);
                if (recovered.length > 0) {
                    toolCalls = recovered;
                    (choice as { finish_reason: string }).finish_reason = "tool_calls";
                }
            }

            if (choice.finish_reason !== "tool_calls") break;

            if (iterations >= MAX_TOOL_ITERATIONS) {
                return Response.json(
                    { error: "The assistant reached the maximum number of steps. Please try a simpler request." },
                    { status: 500 }
                )
            }
            iterations++;

            allMessages.push(choice.message);

            const serialCalls = toolCalls.filter((c: ChatCompletionMessageToolCall) => SERIAL_TOOLS.has(c.function.name));
            const parallelCalls = toolCalls.filter((c: ChatCompletionMessageToolCall) => !SERIAL_TOOLS.has(c.function.name));
            const toolResults: (ChatCompletionMessageParam & { role: "tool" })[] = [];

            if (parallelCalls.length > 0) {
                const results = await Promise.all(
                    parallelCalls.map((call: ChatCompletionMessageToolCall) => executeToolCall(call, driverId, lat, lng))
                )
                toolResults.push(...results);
            }

            for (const call of serialCalls) {
                toolResults.push(await executeToolCall(call, driverId, lat, lng));
            }

            allMessages.push(...toolResults);
            response = await groqCreate(allMessages);
        }

        return Response.json({ message: response.choices[0].message.content });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return Response.json({ error: message }, { status: 500 });
    }
}