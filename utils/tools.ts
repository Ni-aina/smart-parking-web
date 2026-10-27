import { ChatCompletionTool } from "groq-sdk/resources/chat/completions";

export const tools: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_parking_lots",
            description: "Search parking lots by name/address. Returns lotId, categoryId, name, location, pricePerHour, availableSpots, and category constraints (maxWeightTonnes, maxHeightMeters).",
            parameters: {
                type: "object",
                properties: {
                    searchTerm: { type: "string" },
                    checkTime: {
                        type: "string",
                        description: "Time to check occupancy and spot availability for, in natural language (e.g. 'now', 'tomorrow at 2pm', 'sept 15 at 10:00')"
                    },
                    filters: {
                        type: "object",
                        properties: {
                            category: {
                                type: "number",
                                description: "Vehicle category ID to filter parking lots by"
                            },
                            priceRange: {
                                type: "array",
                                items: { type: "number" },
                                minItems: 2,
                                maxItems: 2
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
            description: "Find driver's vehicles by plate, make, or model. Returns vehicleId, categoryId, categoryCode, maxWeightTonnes, and maxHeightMeters.",
            parameters: {
                type: "object",
                properties: {
                    plateNumber: { type: "string" },
                    make: { type: "string" },
                    model: { type: "string" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "check_vehicle_fits_lot",
            description: "Check if a vehicle fits a parking lot's vehicle category constraints using max weight (tonnes) and max height (meters). Returns fits (bool) and reason.",
            parameters: {
                type: "object",
                required: ["vehicleId", "categoryId"],
                properties: {
                    vehicleId: { type: "number", description: "The vehicle ID" },
                    categoryId: { type: "number", description: "The vehicle category ID from the parking lot (as returned from get_parking_lots)" },
                    lotId: { type: "number", description: "Optional parking lot ID" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "check_availability",
            description: "Check available spots in a lot for a time range.",
            parameters: {
                type: "object",
                required: ["lotId", "startTime", "endTime"],
                properties: {
                    lotId: { type: "number" },
                    startTime: { type: "string", description: "Natural language, e.g. 'today at 10am'" },
                    endTime: { type: "string", description: "Natural language, e.g. 'in 2 hours'" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "confirm_reservation",
            description: "Create reservation. Only call after explicit user confirmation (yes/confirm/book).",
            parameters: {
                type: "object",
                required: ["lotId", "vehicleId", "startTime", "endTime"],
                properties: {
                    lotId: { type: "number" },
                    vehicleId: { type: "number" },
                    startTime: { type: "string" },
                    endTime: { type: "string" }
                }
            }
        }
    }
]