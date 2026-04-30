import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import {
    ChatCompletionTool,
    ChatCompletionMessageParam
} from "groq-sdk/resources/chat/completions";
import { createReservationTool, getParkingLots } from "@/actions/lots.action";
import { supabaseAdmin } from "@/lib/supabase/admin";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const tools: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_parking_lots",
            description: "Search and filter parking lots based on user intent",
            parameters: {
                type: "object",
                properties: {
                    searchTerm: {
                        type: "string",
                        description: "Keyword to search parking lots by name or address"
                    },
                    filters: {
                        type: "object",
                        properties: {
                            priceRange: {
                                type: "array",
                                items: { type: "number" },
                                minItems: 2,
                                maxItems: 2,
                                description: "Price range as [min, max], in dollars"
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
                based on what the user described.
            `,
            parameters: {
                type: "object",
                properties: {
                    plateNumber: {
                        type: "string",
                        description: "Full or partial plate number mentioned by the user e.g ABC123"
                    },
                    make: {
                        type: "string",
                        description: "Car brand mentioned by the user e.g Toyota, Honda, etc."
                    },
                    model: {
                        type: "string",
                        description: "Car model mentioned by the user e.g Camry, Civic, etc."
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
                Returns whether the vehicle fits and a reason.
            `,
            parameters: {
                type: "object",
                required: ["vehicleId", "lotType"],
                properties: {
                    vehicleId: {
                        type: "number",
                        description: "The ID of the selected vehicle"
                    },
                    lotType: {
                        type: "object",
                        description: "The parking lot type constraints",
                        required: ["id", "vehicleType", "maxWidth", "maxLength", "maxHeight"],
                        properties: {
                            id: { type: "string" },
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
                        description: "The ID of the parking lot to check"
                    },
                    startTime: {
                        type: "string",
                        description: "Reservation start time as ISO 8601 string e.g. 2025-06-01T10:00:00Z"
                    },
                    endTime: {
                        type: "string",
                        description: "Reservation end time as ISO 8601 string e.g. 2025-06-01T12:00:00Z"
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
                        description: "The ID of the parking lot"
                    },
                    vehicleId: {
                        type: "number",
                        description: "The ID of the vehicle to park"
                    },
                    startTime: {
                        type: "string",
                        description: "Reservation start time as ISO 8601 string"
                    },
                    endTime: {
                        type: "string",
                        description: "Reservation end time as ISO 8601 string"
                    }
                }
            }
        }
    }
]

async function executeGetParkingLots(
    args: Parameters<typeof getParkingLots>[0]
) {
    const result = await getParkingLots(args);
    return result;
}

async function executeGetUserVehicles(
    driverId: string,
    args: {
        plateNumber?: string;
        make?: string;
        model?: string;
    }
) {
    let query = supabaseAdmin
        .from("vehicles")
        .select("id, plate_number, make, model, year, width, length, height")
        .eq("driver_id", driverId);

    if (args.plateNumber) query = query.ilike("plate_number", `%${args.plateNumber}%`);
    if (args.make) query = query.ilike("make", `%${args.make}%`);
    if (args.model) query = query.ilike("model", `%${args.model}%`);

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`);
    if (!data || data.length === 0) return {
        vehicles: [],
        message: "No matching vehicle found. Please check the plate number or car name."
    }

    return { vehicles: data }
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
    const { data: vehicle, error } = await supabaseAdmin
        .from("vehicles")
        .select("width, length, height, make, model")
        .eq("id", vehicleId)
        .eq("driver_id", driverId)
        .maybeSingle();

    if (error || !vehicle) throw new Error(`Vehicle not found: ${error?.message}`);

    const issues: string[] = [];

    if (vehicle.width && vehicle.width > lotType.maxWidth)
        issues.push(`width ${vehicle.width}m exceeds max ${lotType.maxWidth}m`);
    if (vehicle.length && vehicle.length > lotType.maxLength)
        issues.push(`length ${vehicle.length}m exceeds max ${lotType.maxLength}m`);
    if (vehicle.height && vehicle.height > lotType.maxHeight)
        issues.push(`height ${vehicle.height}m exceeds max ${lotType.maxHeight}m`);

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
    try {
        if (!lotId) throw new Error("Lot id is required");
        if (!startTime || !endTime) throw new Error("Start time and end time are required");
        if (startTime > endTime) throw new Error("Start time must be before end time");

        const startDateTime = new Date(startTime);
        const endDateTime = new Date(endTime);

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

        if (lotResult.error) throw new Error(`Lot fetching error, ${lotResult.error.message}`);
        if (reservationsResult.error) throw new Error(`Reservations fetching error, ${reservationsResult.error.message}`);
        if (!lotResult.data) throw new Error("Lot not found");

        const totalSpots = lotResult.data.total_spots;
        const occupiedSpots = reservationsResult.data?.length || 0;

        const availableSpots = totalSpots - occupiedSpots;

        return {
            availableSpots,
            lotId,
            startTime,
            endTime,
            message: availableSpots > 0
                ? `${availableSpots} spot(s) available.`
                : "No spots available for this time range."
        }
    } catch (error) {
        throw error;
    }
}

async function executeConfirmReservation(
    driverId: string,
    lotId: string,
    vehicleId: string,
    startTime: string,
    endTime: string
) {
    const reservation = await createReservationTool({
        driverId,
        lotId,
        vehicleId: String(vehicleId),
        startTime,
        endTime,
        status: "pending"
    })
    return { success: true, reservation }
}

export async function POST(req: NextRequest) {
    try {
        const {
            messages,
            driverId,
            latitude,
            longitude
        } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return Response.json({ error: "Messages array is required" }, { status: 400 });
        }

        if (!driverId) {
            return Response.json({ error: "driverId is required" }, { status: 400 });
        }

        if (!latitude) {
            return Response.json({ error: "latitude is required" }, { status: 400 })
        }

        if (!longitude) {
            return Response.json({ error: "longitude is required" }, { status: 400 })
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return Response.json({ error: "latitude and longitude must be valid numbers" }, { status: 400 });
        }

        const allMessages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `
                    You are a parking reservation assistant. Help the user find parking, select a vehicle, check availability, and confirm a reservation.

                    Follow this strict order:
                        1. Help the user find a parking lot using get_parking_lots if they haven't chosen one.
                        2. Once a lot is chosen, call get_user_vehicles to let them pick a car.
                        3. Once a vehicle is chosen, call check_vehicle_fits_lot to verify it fits the lot type.
                        4. Ask the user for their desired start and end time, then call check_availability.
                        5. Summarize all details (lot, vehicle, times, available spots) and ask the user to confirm.
                        6. ONLY call confirm_reservation after the user explicitly says yes/confirm/book.

                    Never call confirm_reservation without explicit user confirmation.
                    Never reveal latitude/longitude values in your responses.
                    Be concise and friendly.
                `
            },
            ...messages
        ]

        let response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            tools,
            messages: allMessages
        })

        while (response.choices[0].finish_reason === "tool_calls") {
            const assistantMessage = response.choices[0].message;
            allMessages.push(assistantMessage);

            const toolResults = await Promise.all(
                (assistantMessage.tool_calls ?? []).map(async (call) => {
                    const args = JSON.parse(call.function.arguments);
                    let result: unknown;

                    switch (call.function.name) {
                        case "get_parking_lots":
                            result = await executeGetParkingLots({
                                location: {
                                    latitude: lat,
                                    longitude: lng
                                },
                                ...args
                            })
                            break;

                        case "get_user_vehicles":
                            result = await executeGetUserVehicles(driverId, args);
                            break;

                        case "check_vehicle_fits_lot":
                            result = await executeCheckVehicleFitsLot(
                                args.vehicleId,
                                args.lotType,
                                driverId
                            )
                            break;

                        case "check_availability":
                            result = await executeCheckAvailability(
                                args.lotId,
                                args.startTime,
                                args.endTime
                            )
                            break;

                        case "confirm_reservation":
                            result = await executeConfirmReservation(
                                driverId,
                                args.lotId,
                                args.vehicleId,
                                args.startTime,
                                args.endTime
                            )
                            break;

                        default:
                            result = { error: `Unknown tool: ${call.function.name}` }
                    }

                    return {
                        role: "tool" as const,
                        tool_call_id: call.id,
                        content: JSON.stringify(result)
                    }
                })
            )

            allMessages.push(...toolResults);

            response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                tools,
                messages: allMessages
            })
        }

        return Response.json({ message: response.choices[0].message.content });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return Response.json({ error: message }, { status: 500 });
    }
}