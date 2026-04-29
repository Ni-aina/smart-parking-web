import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { ChatCompletionTool, ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
let count = 0;

const tools: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "getCount",
            description: "Get the current count"
        }
    },
    {
        type: "function",
        function: {
            name: "increment",
            description: "Increment the count by 1"
        },
    },
    {
        type: "function",
        function: {
            name: "decrement",
            description: "Decrement the count by 1"
        }
    },
    {
        type: "function",
        function: {
            name: "reset",
            description: "Reset the count to 0"
        }
    }
]

async function executeTool(name: string) {
    switch (name) {
        case "getCount":
            return { count }
        case "increment":
            count++
            return { count }
        case "decrement":
            count--
            return { count }
        case "reset":
            count = 0
            return { count }
        default:
            return { error: "Unknown tool" }
    }
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return Response.json({ error: "Messages array is required" }, { status: 400 })
        }

        const lastMessage = messages[messages.length - 1].content as string;

        const allowedKeywords = ["increment", "decrement", "reset", "get"]
        const isRelevant = allowedKeywords.some(k => lastMessage.toLowerCase().includes(k))
        if (!isRelevant) {
            return Response.json({ message: "I can only manage the counter. Try: increment, decrement, get count, or reset." })
        }

        const allMessages: ChatCompletionMessageParam[] = [
            { role: "system", content: "You manage a counter." },
            ...messages
        ]

        let response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            tools,
            messages: allMessages
        })

        while (response.choices[0].finish_reason === "tool_calls") {
            const assistantMessage = response.choices[0].message
            allMessages.push(assistantMessage)

            const toolResults = await Promise.all(
                (assistantMessage.tool_calls ?? []).map(async (call) => {
                    const result = await executeTool(call.function.name)
                    return {
                        role: "tool" as const,
                        tool_call_id: call.id,
                        content: JSON.stringify(result)
                    }
                })
            )

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