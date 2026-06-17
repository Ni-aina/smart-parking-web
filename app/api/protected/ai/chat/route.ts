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
const MAX_TOOL_ITERATIONS = 8;
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
    const rawTerm = args?.searchTerm?.trim();
    const searchTerm = rawTerm?.includes(" ") ? rawTerm.split(" ")[0] : rawTerm;

    const result = await getParkingLots(
        {
            location: { latitude: lat, longitude: lng },
            ...args,
            searchTerm
        })

    return {
        ...result,
        data: result.data.map((lot: LotInterface) => ({
            lotId: lot.id,
            name: lot.name,
            location: lot.location,
            totalSpots: lot.totalSpots,
            pricePerHour: lot.pricePerHour,
            typeId: lot.typeId
        }))
    }
}

async function executeGetUserVehicles(driverId: string, args: { plateNumber?: string; make?: string; model?: string } | null) {
    const clean = (value?: string) => {
        if (!value) return undefined;

        const v = value.trim().toLowerCase();

        if (
            v === "null" ||
            v === "undefined" ||
            v === "none" ||
            v === ""
        ) {
            return undefined;
        }

        return value.trim();
    }

    const plate = clean(args?.plateNumber);
    const make = clean(args?.make);
    const model = clean(args?.model);

    let query = supabaseAdmin
        .from("vehicles")
        .select("id, plate_number, make, model, year, width, length, height")
        .eq("driver_id", driverId);

    if (plate) query = query.ilike("plate_number", `%${plate}%`);
    if (make) query = query.ilike("make", `%${make}%`);
    if (model) query = query.ilike("model", `%${model}%`);

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
    if (!data || data.length === 0) return { vehicles: [], message: "No matching vehicle found." }
    return { vehicles: data.map(item => ({ ...item, vehicleId: item.id })) }
}

const executeCheckVehicleFitsLot = async (
    vehicleId: number,
    typeId: number,
    driverId: string
) => {
    const { data: lotType, error: lotTypeError } = await supabaseAdmin
        .from("lot_types")
        .select("id, vehicle_type, description, max_width, max_length, max_height")
        .eq("id", typeId)
        .maybeSingle();
    if (lotTypeError || !lotType) return { fits: false, reason: "Lot type not found or could not be fetched." }

    const { data: vehicle, error: vehicleError } = await supabaseAdmin
        .from("vehicles")
        .select("width, length, height, make, model")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle();
    if (vehicleError || !vehicle) return { fits: false, reason: "Vehicle not found or access denied." }

    const widthFits = vehicle.width <= lotType.max_width;
    const lengthFits = vehicle.length <= lotType.max_length;
    const heightFits = vehicle.height <= lotType.max_height;
    const fits = widthFits && lengthFits && heightFits;

    const issues: string[] = [];
    if (!widthFits) issues.push(`width ${vehicle.width}m exceeds max ${lotType.max_width}m`);
    if (!lengthFits) issues.push(`length ${vehicle.length}m exceeds max ${lotType.max_length}m`);
    if (!heightFits) issues.push(`height ${vehicle.height}m exceeds max ${lotType.max_height}m`);

    return {
        fits,
        vehicle: { make: vehicle.make, model: vehicle.model },
        lotType: lotType.vehicle_type,
        reason: fits
            ? `${vehicle.make} ${vehicle.model} fits within the ${lotType.vehicle_type} lot constraints.`
            : `${vehicle.make} ${vehicle.model} does not fit: ${issues.join(", ")}.`
    }
}

async function executeCheckAvailability(
    lotId: number,
    startTime: string,
    endTime: string,
    timezoneOffset: number
) {
    if (!lotId) throw new Error("Lot id is required");
    if (!startTime || !endTime) throw new Error("Start time and end time are required");
    const parsedStartTime = parseUserTime(startTime, timezoneOffset);
    const parsedEndTime = parseUserTime(endTime, timezoneOffset);
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

async function executeConfirmReservation(
    driverId: string,
    lotId: number,
    vehicleId: number,
    startTime: string,
    endTime: string,
    timezoneOffset: number
) {
    const { data: vehicle, error: isNotMatch } = await supabaseAdmin
        .from("vehicles")
        .select("id")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle();
    if (!vehicle || isNotMatch) throw new Error(`Vehicle not found or access denied, ${isNotMatch?.message}`);
    const parsedStartTime = parseUserTime(startTime, timezoneOffset);
    const parsedEndTime = parseUserTime(endTime, timezoneOffset);
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
    lng: number,
    timezoneOffset: number
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
                result = await executeCheckVehicleFitsLot(args.vehicleId, args.typeId, driverId);
                break;
            case "check_availability":
                result = await executeCheckAvailability(args.lotId, args.startTime, args.endTime, timezoneOffset);
                break;
            case "confirm_reservation":
                result = await executeConfirmReservation(driverId, args.lotId, args.vehicleId, args.startTime, args.endTime, timezoneOffset);
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
    let isFr = false;

    try {
        const {
            messages,
            driverId,
            latitude,
            longitude,
            timezoneOffset,
            i18nLanguage
        } = await req.json();

        isFr = i18nLanguage === "fr";

        if (!messages || !Array.isArray(messages) || messages.length === 0)
            return Response.json({ error: isFr ? "Le tableau de messages est requis" : "Messages array is required" }, { status: 400 });
        if (!driverId || typeof driverId !== "string")
            return Response.json({ error: isFr ? "L'identifiant du conducteur est requis" : "driverId is required" }, { status: 400 });
        if (latitude == null || longitude == null)
            return Response.json({ error: isFr ? "La latitude et la longitude sont requises" : "latitude and longitude are required" }, { status: 400 });
        if (typeof timezoneOffset !== "number")
            return Response.json({ error: isFr ? "Le décalage horaire est requis" : "timezoneOffset is required" }, { status: 400 });

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng))
            return Response.json({ error: isFr ? "La latitude et la longitude doivent être des nombres valides" : "latitude and longitude must be valid numbers" }, { status: 400 });

        const boundedMessages = (messages.slice(-MAX_MESSAGE_COUNT) as (ChatCompletionMessageParam & { reasoning?: unknown; reasoning_content?: unknown })[]).map(
            ({ reasoning, reasoning_content, ...rest }) => rest
        )

        const offsetMs = timezoneOffset * 60 * 1000;
        const localNow = new Date(Date.now() + offsetMs);
        const today = localNow.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })

        const allMessages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `
                    You are a parking reservation assistant.
                    Today is ${today}.

                    STEPS — follow in strict order, never skip or reorder:
                    STEP 1 — get_parking_lots: Call if no lot is selected yet. If exactly 1 result, auto-select and proceed to step 2 immediately.
                    STEP 2 — get_user_vehicles: Call if no vehicle is selected yet. If exactly 1 result, auto-select and proceed to step 3 immediately.
                    STEP 3 — check_vehicle_fits_lot: MANDATORY. Use vehicleId and typeId from tool results. If fits: false, stop and inform the user — do NOT continue.
                    STEP 4 — Ask for start and end time: ONLY after step 3 returned fits: true. Wait for the user to provide both.
                    STEP 5 — check_availability: Call only after the user has provided both start and end time in this conversation.
                    STEP 6 — Summary and confirmation request: Show full reservation details and explicitly ask the user to confirm.
                    STEP 7 — confirm_reservation: Call ONLY if the user sends an explicit confirmation word ("yes", "confirm", "book it", or equivalent). A vague reply is NOT confirmation — ask again.

                    STEP GATE RULES — each gate must be passed before the next step:
                    - STEP 1 gate: a lot must be explicitly selected by the user (or auto-selected) before calling get_user_vehicles
                    - STEP 2 gate: a vehicle must be explicitly selected by the user (or auto-selected) before calling check_vehicle_fits_lot
                    - STEP 3 gate: check_vehicle_fits_lot must have returned fits: true before asking for time
                    - STEP 5 gate: check_availability must be complete and results displayed before showing the summary
                    - STEP 6 gate: the summary must be displayed and the user must reply with an explicit confirmation word before calling confirm_reservation
                    - Auto-selection (exactly 1 result) is the ONLY exception that allows proceeding without waiting for user input
                    - Each step must produce a visible message to the user before the next step begins

                    TOOL CALL RULES — never violate:
                    - NEVER call get_user_vehicles in the same turn as get_parking_lots unless exactly 1 lot was auto-selected
                    - NEVER call check_vehicle_fits_lot in the same turn as get_user_vehicles unless exactly 1 vehicle was auto-selected
                    - NEVER call check_vehicle_fits_lot for multiple vehicles — only for the single vehicle the user explicitly selected
                    - NEVER call check_availability before a lot and a vehicle are both confirmed and the user has given start and end time
                    - NEVER call confirm_reservation if check_vehicle_fits_lot returned fits: false
                    - NEVER call confirm_reservation without an explicit confirmation word from the user in the immediately preceding message
                    - If you need lotId, typeId, or vehicleId to proceed, re-call the relevant tool silently — do NOT ask the user
                    - Tool results from previous turns are not in your context; re-call tools silently when needed
                    - Never use list positions as IDs — always use the database IDs from tool results internally
                    - Pass time strings exactly as the user wrote them — never convert to ISO yourself

                    DISPLAY RULES — always apply:
                    - After get_parking_lots: list EVERY lot with name, location, and price/hour. Use "Here is an available parking lot:" for 1, or "Here are some available parking lots:" for multiple.
                    - After get_user_vehicles: list EVERY vehicle with make, model, and plate number. Use "Here is your vehicle:" for 1, or "Here are your vehicles:" for multiple.
                    - After check_vehicle_fits_lot: confirm whether the vehicle fits or not with a reason.
                    - After check_availability: show available spots, start time, and end time. Match grammar to the count.
                    - Never say "I found some options" without immediately listing them.
                    - Always use "your" when referring to the user's vehicles.
                    - Always use neutral phrasing for parking lots.
                    - NEVER display any database ID (lotId, typeId, vehicleId, reservationId) to the user.

                    GENERAL RULES:
                    - NEVER ask about a future step while the current step is incomplete
                    - NEVER skip any step even if the user says "proceed", "next", or "book it" before reaching step 7
                    - NEVER invent, assume, or default start/end times
                    - NEVER ask the user for data you can retrieve via a tool call
                    - NEVER return an empty message
                    - If the user volunteers information for a future step, store it mentally — do NOT act on it or skip ahead
                    - Price is in USD. Be concise and friendly.
                    - Never reveal lat/lng values.
                    - Always reply in ${isFr ? "French" : "English"}. Never switch languages regardless of what the user writes.
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
                    {
                        message: isFr
                            ? "Je rencontre quelques difficultés à traiter votre demande. Pourriez-vous reformuler ou la diviser en étapes plus simples ? Je suis là pour vous aider ! 😊"
                            : "I'm sorry, I'm having a bit of trouble processing your request right now. Could you try rephrasing or breaking it into smaller steps? I'm happy to help! 😊"
                    },
                    { status: 200 }
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
                    parallelCalls.map((call: ChatCompletionMessageToolCall) => executeToolCall(call, driverId, lat, lng, timezoneOffset))
                )
                toolResults.push(...results);
            }

            for (const call of serialCalls) {
                toolResults.push(await executeToolCall(call, driverId, lat, lng, timezoneOffset));
            }

            allMessages.push(...toolResults);
            response = await groqCreate(allMessages);
        }

        return Response.json({ message: response.choices[0].message.content });

    } catch (error: unknown) {
        const raw = error instanceof Error ? error.message : String(error);

        if (raw.includes("rate_limit_exceeded") || raw.includes("Rate limit")) {
            const retryMatch = raw.match(/try again in ([^.]+)/i);
            const retryIn = retryMatch ? ` ${isFr ? "Veuillez réessayer dans" : "Please try again in"} ${retryMatch[1]}.` : isFr ? " Veuillez réessayer dans quelques minutes." : " Please try again in a few minutes.";
            return Response.json({ message: isFr ? `Nous avons atteint notre limite de requêtes.${retryIn} Désolé pour la gêne occasionnée ! 🙏` : `We've hit our request limit for now.${retryIn} Sorry for the inconvenience! 🙏` }, { status: 200 });
        }
        if (raw.includes("timeout") || raw.includes("Timeout")) {
            return Response.json({ message: isFr ? "La requête a pris trop de temps. Veuillez réessayer — cela fonctionne généralement au prochain essai ! ⏱️" : "The request took too long to complete. Please try again — it usually works on the next attempt! ⏱️" }, { status: 200 });
        }
        if (raw.includes("tool_use_failed") || raw.includes("Failed to call a function")) {
            return Response.json({ message: isFr ? "J'ai rencontré un petit problème lors du traitement de votre demande. Pourriez-vous réessayer ? Je ferai mieux ! 😅" : "I ran into a small hiccup while processing your request. Could you try again? I'll do better! 😅" }, { status: 200 });
        }
        if (raw.includes("model_decommissioned")) {
            return Response.json({ message: isFr ? "Je suis actuellement en cours de mise à jour. Veuillez réessayer dans un instant ! 🔧" : "I'm currently undergoing some updates. Please try again shortly! 🔧" }, { status: 200 });
        }
        if (raw.includes("invalid_request_error")) {
            return Response.json({ message: isFr ? "J'ai reçu une entrée inattendue. Pourriez-vous reformuler votre demande et réessayer ? 😊" : "I received an unexpected input. Could you rephrase your request and try again? 😊" }, { status: 200 });
        }

        return Response.json({ error: raw }, { status: 500 });
    }
}