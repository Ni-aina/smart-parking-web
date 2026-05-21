import { ChatCompletionTool } from "groq-sdk/resources/chat/completions";

export const tools: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_parking_lots",
            description: "Search parking lots by name/address. Returns lotId, typeId, name, location, pricePerHour.",
            parameters: {
                type: "object",
                properties: {
                    searchTerm: { type: "string" },
                    filters: {
                        type: "object",
                        properties: {
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
            description: "Find driver's vehicles by plate, make, or model. Returns vehicleId.",
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
            description: "Check if a vehicle fits a lot's size constraints. Returns fits (bool) and reason.",
            parameters: {
                type: "object",
                required: ["vehicleId", "typeId"],
                properties: {
                    vehicleId: { type: "number" },
                    typeId: { type: "number", description: "The lot type id as returned from get_parking_lots" }
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