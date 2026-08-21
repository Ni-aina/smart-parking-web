
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const getAuthUser = async (req: Request) => {
    const userIdHeader = req.headers.get("x-user-id")
    if (userIdHeader) {
        return userIdHeader
    }
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
}

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const POST = async (req: Request) => {
    try {
        const ownerId = await getAuthUser(req)
        if (!ownerId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { emailAddress } = await req.json()

        if (!emailAddress || !isValidEmail(emailAddress)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            )
        }

        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            emailAddress,
            {
                redirectTo: "SmartParking://auth/setPassword"
            }
        )

        if (inviteError) {
            return NextResponse.json(
                { error: inviteError?.message || "Failed to send invitation" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: "Invitation sent successfully" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error)?.message || "Internal server error" },
            { status: 500 }
        )
    }
}