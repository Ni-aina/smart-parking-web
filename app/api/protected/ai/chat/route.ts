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
            })
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
            lotType: {
                id: lot.lotType.id,
                vehicleType: lot.lotType.vehicleType,
                description: lot.lotType.description,
                maxWidth: lot.lotType.maxWidth,
                maxLength: lot.lotType.maxLength,
                maxHeight: lot.lotType.maxHeight
            },
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

const executeCheckVehicleFitsLot = async (
    vehicleId: number,
    lotType: {
        id: number;
        vehicleType: string;
        description: string;
        maxWidth: number;
        maxLength: number;
        maxHeight: number;
    },
    driverId: string
) => {
    if (!lotType?.id || !lotType?.maxWidth || !lotType?.maxLength || !lotType?.maxHeight) {
        return { fits: false, reason: "Lot type constraints are missing. Please retry." }
    }

    const { data: vehicle, error: vehicleError } = await supabaseAdmin
        .from("vehicles")
        .select("width, length, height, make, model")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle();
    if (vehicleError || !vehicle) return { fits: false, reason: "Vehicle not found or access denied." }

    const widthFits = vehicle.width <= lotType.maxWidth;
    const lengthFits = vehicle.length <= lotType.maxLength;
    const heightFits = vehicle.height <= lotType.maxHeight;
    const fits = widthFits && lengthFits && heightFits;

    const issues: string[] = [];
    if (!widthFits) issues.push(`width ${vehicle.width}m exceeds max ${lotType.maxWidth}m`);
    if (!lengthFits) issues.push(`length ${vehicle.length}m exceeds max ${lotType.maxLength}m`);
    if (!heightFits) issues.push(`height ${vehicle.height}m exceeds max ${lotType.maxHeight}m`);

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

        const boundedMessages = (messages.slice(-MAX_MESSAGE_COUNT) as (ChatCompletionMessageParam & { reasoning?: unknown; reasoning_content?: unknown })[]).map(
            ({ reasoning, reasoning_content, ...rest }) => rest
        )

        const allMessages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `
                    You are a parking reservation assistant. 
                    Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

                    Follow this strict order to complete a reservation — NEVER skip or reorder steps:
                    1. get_parking_lots — always call this first
                    2. get_user_vehicles — always call this to fetch vehicles
                    3. check_vehicle_fits_lot — MANDATORY; pass the full lotType object exactly as returned from get_parking_lots for the chosen lot; if fits is false, stop and inform the user — do NOT proceed
                    4. check_availability — MANDATORY; NEVER assume or invent times; if user has not provided start and end time, ask before calling this tool
                    5. Summarise and ask for confirmation
                    6. confirm_reservation — only after explicit user confirmation ("yes", "book it", "confirm", etc.)

                    Display rules — ALWAYS:
                    - After get_parking_lots: list EVERY lot with its name, location, and price/hour under the heading "Here are some available parking lots:" — never show lotId
                    - After get_user_vehicles: list EVERY vehicle with its make, model, and plate number under the heading "Here are your vehicles:" — never show vehicleId
                    - After check_availability: show available spots, start time, and end time — never show lotId
                    - After check_vehicle_fits_lot: confirm whether the vehicle fits or not with a reason
                    - Never say "I found some options" without immediately listing them
                    - Always use "your" when referring to the user's vehicles (e.g. "your vehicles", "your chevrolet cruze")
                    - Always use neutral phrasing for parking lots (e.g. "available parking lots", "nearby parking lots")
                    - NEVER display any database ID (lotId, vehicleId, reservationId) to the user under any circumstances

                    Critical rules:
                    - NEVER skip any step even if the user asks to "proceed" or "book it" directly
                    - NEVER invent, assume, or default start/end times — always ask the user if not explicitly provided
                    - NEVER call check_availability before the user has given a start time and end time in this conversation
                    - NEVER call check_vehicle_fits_lot before the user has chosen a vehicle
                    - NEVER call confirm_reservation if check_vehicle_fits_lot returned fits: false — inform the user and stop
                    - NEVER repeat information already shown in a previous assistant message — only display new results from the current step
                    - NEVER ask the user for data you can retrieve via a tool call
                    - NEVER return an empty message — if you are blocked or missing information, always ask the user for what you need
                    - If you need lotId or vehicleId to proceed, re-call the relevant tool silently — do NOT ask the user
                    - Tool results from previous turns are not in your context; re-call tools silently when needed
                    - Never use list positions as IDs — always use the database lotId/vehicleId from tool results internally
                    - Pass time strings exactly as the user wrote them — never convert to ISO yourself
                    - Price is in USD. Be concise and friendly
                    - Never reveal lat/lng values
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

            const { reasoning, reasoning_content, ...sanitizedMessage } = choice.message as typeof choice.message & { reasoning?: unknown; reasoning_content?: unknown };
            allMessages.push(sanitizedMessage);

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