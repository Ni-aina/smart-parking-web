import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import {
    ChatCompletionTool,
    ChatCompletionMessageParam,
    ChatCompletionMessageToolCall
} from "groq-sdk/resources/chat/completions";
import { getParkingLots } from "@/actions/lots.action";
import { supabaseAdmin } from "@/lib/supabase/admin";
import parseUserTime from "@/utils/DateConverstion";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { LotInterface } from "@/types/lot";

const MAX_TOOL_ITERATIONS = 10;
const MAX_MESSAGE_COUNT = 40;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

const tools: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_parking_lots",
            description: `
                Search and filter parking lots. Each result includes a 'lotId' field
                — this is the value that must be passed to other tools.
            `,
            parameters: {
                type: "object",
                properties: {
                    searchTerm: {
                        type: "string",
                        description: "Keyword to search parking lots by name or address e.g 'CCI Ivato'"
                    },
                    filters: {
                        type: "object",
                        properties: {
                            priceRange: {
                                type: "array",
                                items: { type: "number" },
                                minItems: 2,
                                maxItems: 2,
                                description: "Price range as [min, max]"
                            }
                        }
                    },
                    pagination: {
                        type: "object",
                        properties: {
                            page: { type: "number" },
                            limit: { type: "number" }
                        }
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_user_vehicles",
            description: `
                Search the driver's registered vehicles by plate number, make, or model 
                based on what the user described. The result includes a 'vehicleId' field
                — this is the value that must be passed to other tools.
            `,
            parameters: {
                type: "object",
                properties: {
                    plateNumber: {
                        type: "string",
                        description: "Full or partial plate number mentioned by the user e.g '90524 WWT'"
                    },
                    make: {
                        type: "string",
                        description: "The creator mentioned by the user e.g 'France', 'Japan', 'Germany', etc."
                    },
                    model: {
                        type: "string",
                        description: "Car model mentioned by the user e.g 'Audi RS7', 'Toyota V6', 'Sprinter' etc."
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "check_vehicle_fits_lot",
            description: `
                Check if a vehicle's dimensions fit within a parking lot type's constraints.
                The lotType argument MUST be populated from the lotType field of the chosen lot 
                in the get_parking_lots result. Never pass null for any lotType field.
                Returns whether the vehicle fits and a reason.
            `,
            parameters: {
                type: "object",
                required: ["vehicleId", "lotType"],
                properties: {
                    vehicleId: {
                        type: "number",
                        description: "The exact 'vehicleId' field from the get_user_vehicles result. Never use the list position number."
                    },
                    lotType: {
                        type: "object",
                        description: "The parking lot type constraints",
                        required: ["id", "vehicleType", "maxWidth", "maxLength", "maxHeight"],
                        properties: {
                            id: { type: "number" },
                            vehicleType: { type: "string" },
                            description: { type: "string" },
                            maxWidth: { type: "number" },
                            maxLength: { type: "number" },
                            maxHeight: { type: "number" }
                        }
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "check_availability",
            description: `
                Check how many spots are available in a parking lot for a given time range. 
                Returns the number of available spots.
            `,
            parameters: {
                type: "object",
                required: ["lotId", "startTime", "endTime"],
                properties: {
                    lotId: {
                        type: "number",
                        description: "The exact 'lotId' field from the get_parking_lots result. Never use the list position number."
                    },
                    startTime: {
                        type: "string",
                        description: "Reservation start time as provided by the user e.g. 'today at 10am, tomorrow at 9am', 'June 1st at 2pm'"
                    },
                    endTime: {
                        type: "string",
                        description: "Reservation end time as provided by the user e.g. 'in 2 hours', 'tomorrow at noon', 'June 1st at 5pm'"
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "confirm_reservation",
            description: `
                Create the reservation ONLY after the user has explicitly confirmed they want to proceed. 
                Do NOT call this without an explicit user confirmation like 'yes', 'confirm', 'book it', etc.
            `,
            parameters: {
                type: "object",
                required: ["lotId", "vehicleId", "startTime", "endTime"],
                properties: {
                    lotId: {
                        type: "number",
                        description: "The exact 'lotId' field from the get_parking_lots result. Never use the list position number."
                    },
                    vehicleId: {
                        type: "number",
                        description: "The exact 'vehicleId' field from the get_user_vehicles result. Never use the list position number."
                    },
                    startTime: {
                        type: "string",
                        description: "Reservation start time as provided by the user e.g. 'today at 10am', 'tomorrow at 3pm'"
                    },
                    endTime: {
                        type: "string",
                        description: "Reservation end time as provided by the user e.g. 'in 2 hours', 'tomorrow at 5pm'"
                    }
                }
            }
        }
    }
]

async function executeGetParkingLots(
    args: Parameters<typeof getParkingLots>[0]
) {
    const result = await getParkingLots(args)
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

async function executeGetUserVehicles(
    driverId: string,
    args: {
        plateNumber?: string;
        make?: string;
        model?: string;
    } | null
) {
    const { plateNumber, make, model } = args ?? {}

    let query = supabaseAdmin
        .from("vehicles")
        .select("id, plate_number, make, model, year, width, length, height")
        .eq("driver_id", driverId)

    if (plateNumber) query = query.ilike("plate_number", `%${plateNumber}%`)
    if (make) query = query.ilike("make", `%${make}%`)
    if (model) query = query.ilike("model", `%${model}%`)

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`)
    if (!data || data.length === 0) return {
        vehicles: [],
        message: "No matching vehicle found. Please check the plate number or car name."
    }

    return {
        vehicles: data.map(item => ({
            ...item,
            vehicleId: item.id
        }))
    }
}

async function executeCheckVehicleFitsLot(
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
) {
    if (
        typeof lotType.maxWidth !== "number" ||
        typeof lotType.maxLength !== "number" ||
        typeof lotType.maxHeight !== "number"
    ) {
        return {
            fits: false,
            reason: "Lot type dimension data is incomplete. Please re-select the parking lot."
        }
    }

    const { data: vehicle, error } = await supabaseAdmin
        .from("vehicles")
        .select("width, length, height, make, model")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle()

    if (error || !vehicle) throw new Error(`Vehicle not found: ${error?.message}`)

    const issues: string[] = []

    if (vehicle.width && vehicle.width > lotType.maxWidth)
        issues.push(`width ${vehicle.width}m exceeds max ${lotType.maxWidth}m`)
    if (vehicle.length && vehicle.length > lotType.maxLength)
        issues.push(`length ${vehicle.length}m exceeds max ${lotType.maxLength}m`)
    if (vehicle.height && vehicle.height > lotType.maxHeight)
        issues.push(`height ${vehicle.height}m exceeds max ${lotType.maxHeight}m`)

    const fits = issues.length === 0

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
    if (!lotId) throw new Error("Lot id is required")
    if (!startTime || !endTime) throw new Error("Start time and end time are required")

    const parsedStartTime = parseUserTime(startTime)
    const parsedEndTime = parseUserTime(endTime)

    const startDateTime = new Date(parsedStartTime)
    const endDateTime = new Date(parsedEndTime)

    if (startDateTime >= endDateTime) throw new Error("Start time must be before end time")

    const [lotResult, reservationsResult] = await Promise.all([
        supabaseAdmin
            .from("parking_lots")
            .select("total_spots")
            .eq("id", lotId)
            .single(),
        supabaseAdmin
            .from("reservations")
            .select("id")
            .eq("lot_id", lotId)
            .eq("status", "active")
            .or(`and(start_time.lte.${endDateTime.toISOString()},end_time.gte.${startDateTime.toISOString()})`)
    ])

    if (lotResult.error) throw new Error(`Lot fetching error: ${lotResult.error.message}`)
    if (reservationsResult.error) throw new Error(`Reservations fetching error: ${reservationsResult.error.message}`)
    if (!lotResult.data) throw new Error("Lot not found")

    const totalSpots = lotResult.data.total_spots
    const occupiedSpots = reservationsResult.data?.length ?? 0
    const availableSpots = totalSpots - occupiedSpots

    return {
        availableSpots,
        lotId,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        message: availableSpots > 0
            ? `${availableSpots} spot(s) available.`
            : "No spots available for this time range."
    }
}

async function executeConfirmReservation(
    driverId: string,
    lotId: number,
    vehicleId: number,
    startTime: string,
    endTime: string
) {
    const {
        data: vehicle,
        error: isNotMatch
    } = await supabaseAdmin
        .from("vehicles")
        .select("id")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle()

    if (!vehicle || isNotMatch) {
        throw new Error(`Vehicle not found or access denied, ${isNotMatch?.message}`);
    }

    const parsedStartTime = parseUserTime(startTime)
    const parsedEndTime = parseUserTime(endTime)

    const payload = denormalizeData({
        driverId,
        lotId: String(lotId),
        vehicleId: String(vehicleId),
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        status: "pending"
    })

    const { data: newReservation, error } = await supabaseAdmin
        .from("reservations")
        .insert([payload])
        .select()

    if (!newReservation || error) {
        throw new Error(`An error occurred during reservation creation: ${error?.message}`)
    }

    const reservation = normalizeData(newReservation)
    return { success: true, reservation }
}

const SERIAL_TOOLS = new Set(["confirm_reservation"])

async function executeToolCall(
    call: ChatCompletionMessageToolCall,
    driverId: string,
    lat: number,
    lng: number
): Promise<ChatCompletionMessageParam & { role: "tool" }> {
    let result: unknown

    try {
        const args = JSON.parse(call.function.arguments)

        switch (call.function.name) {
            case "get_parking_lots":
                result = await executeGetParkingLots({
                    location: { latitude: lat, longitude: lng },
                    ...args
                })
                break

            case "get_user_vehicles":
                result = await executeGetUserVehicles(driverId, args)
                break

            case "check_vehicle_fits_lot":
                result = await executeCheckVehicleFitsLot(args.vehicleId, args.lotType, driverId)
                break

            case "check_availability":
                result = await executeCheckAvailability(args.lotId, args.startTime, args.endTime)
                break

            case "confirm_reservation":
                result = await executeConfirmReservation(
                    driverId,
                    args.lotId,
                    args.vehicleId,
                    args.startTime,
                    args.endTime
                )
                break

            default:
                result = { error: `Unknown tool: ${call.function.name}` }
        }
    } catch (err) {
        result = {
            error: err instanceof Error ? err.message : String(err)
        }
    }

    return {
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result)
    }
}

export async function POST(req: NextRequest) {
    try {
        const { messages, driverId, latitude, longitude } = await req.json()

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return Response.json({ error: "Messages array is required" }, { status: 400 })
        }

        if (!driverId || typeof driverId !== "string") {
            return Response.json({ error: "driverId is required" }, { status: 400 })
        }

        if (latitude === undefined || latitude === null) {
            return Response.json({ error: "latitude is required" }, { status: 400 })
        }

        if (longitude === undefined || longitude === null) {
            return Response.json({ error: "longitude is required" }, { status: 400 })
        }

        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)

        if (isNaN(lat) || isNaN(lng)) {
            return Response.json({ error: "latitude and longitude must be valid numbers" }, { status: 400 })
        }

        const boundedMessages = messages.slice(-MAX_MESSAGE_COUNT) as ChatCompletionMessageParam[]

        const allMessages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `
                    You are a parking reservation assistant. Help the user find parking, select a vehicle, check availability, and confirm a reservation.

                    Follow this strict order:
                        1. Help the user find a parking lot using get_parking_lots if they haven't chosen one.
                        2. Once a lot is chosen, call get_user_vehicles to let them pick a car.
                        3. Once a vehicle is selected, call check_vehicle_fits_lot. 
                            Use the vehicleId from get_user_vehicles and the lotType object 
                            from the SAME lot entry in the get_parking_lots result where lotId matches the chosen lot.
                            The lotType fields (id, vehicleType, maxWidth, maxLength, maxHeight) are in the lot data — do NOT leave them null.
                        4. Ask the user for their desired start and end time, then call check_availability.
                        5. Summarize all details (lot, vehicle, times, available spots) and ask the user to confirm.
                        6. ONLY call confirm_reservation after the user explicitly says yes/confirm/book.

                    CRITICAL: 
                    Always use exact database IDs from tool results, never list position numbers.
                    - lotId: use the "lotId" field from get_parking_lots (e.g. 35, 41, 78 — NOT 1, 2, 3...)
                    - vehicleId: use the "vehicleId" field from get_user_vehicles (e.g. 27, 30, 45 — NOT 1, 2, 3...)
                    These are database identifiers and can be any number.
                    Don't jump any step, force user the follow these steps
                    The price is in dollars only.

                    For times, accept any natural language the user provides such as "tomorrow at 2pm", "next Monday at 9am".
                    Pass the user's exact time phrasing to the tools — do NOT convert to ISO yourself.

                    If a tool returns an { error } object, explain the issue to the user in plain language and ask them to try again or provide different input.

                    Never call confirm_reservation without explicit user confirmation.
                    Never reveal latitude/longitude values in your responses.
                    Be concise and friendly.
                `
            },
            ...boundedMessages
        ]

        let response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            tools,
            messages: allMessages
        })

        let iterations = 0

        while (response.choices[0].finish_reason === "tool_calls") {
            if (iterations >= MAX_TOOL_ITERATIONS) {
                return Response.json(
                    { error: "The assistant reached the maximum number of steps. Please try a simpler request." },
                    { status: 500 }
                )
            }
            iterations++

            const assistantMessage = response.choices[0].message
            allMessages.push(assistantMessage)

            const toolCalls = assistantMessage.tool_calls ?? []

            const serialCalls = toolCalls.filter(c => SERIAL_TOOLS.has(c.function.name))
            const parallelCalls = toolCalls.filter(c => !SERIAL_TOOLS.has(c.function.name))

            const toolResults: (ChatCompletionMessageParam & { role: "tool" })[] = []

            if (parallelCalls.length > 0) {
                const parallelResults = await Promise.all(
                    parallelCalls.map(call => executeToolCall(call, driverId, lat, lng))
                )
                toolResults.push(...parallelResults)
            }

            for (const call of serialCalls) {
                const result = await executeToolCall(call, driverId, lat, lng)
                toolResults.push(result)
            }

            allMessages.push(...toolResults)

            response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                tools,
                messages: allMessages
            })
        }

        return Response.json({ message: response.choices[0].message.content })

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return Response.json({ error: message }, { status: 500 })
    }
}