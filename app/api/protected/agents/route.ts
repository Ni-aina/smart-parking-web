import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizeData } from "@/utils/normalizeData";

const getAuthUser = async (req: Request) => {
    const userIdHeader = req.headers.get("x-user-id")
    if (userIdHeader) {
        return userIdHeader
    }
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
}

export const POST = async (req: Request) => {
    try {
        const ownerId = await getAuthUser(req)
        if (!ownerId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { fullName, emailAddress, phoneNumber } = await req.json()

        if (!fullName || !emailAddress || !phoneNumber) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            emailAddress,
            {
                data: {
                    full_name: fullName,
                    phone_number: phoneNumber
                },
                redirectTo: "SmartParking://auth/updatePassword"
            }
        )

        if (inviteError || !inviteData?.user) {
            return NextResponse.json(
                { error: inviteError?.message || "Failed to send invitation email" },
                { status: 400 }
            )
        }

        const agentId = inviteData.user.id

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .upsert(
                {
                    id: agentId,
                    full_name: fullName,
                    email_address: emailAddress,
                    phone_number: phoneNumber,
                    roles: ["driver", "agent"],
                    agent_creator_id: ownerId
                },
                { onConflict: "id" }
            )
            .select()
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: profileError?.message || "Failed to create agent profile" },
                { status: 500 }
            )
        }

        const normalized = normalizeData(profile)

        return NextResponse.json(
            { data: normalized, message: "Agent invited successfully" },
            { status: 201 }
        )
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error)?.message || "Internal server error" },
            { status: 500 }
        )
    }
}

export const PUT = async (req: Request) => {
    try {
        const ownerId = await getAuthUser(req)
        if (!ownerId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { id, fullName, phoneNumber } = await req.json()

        if (!id || !fullName || !phoneNumber) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({
                full_name: fullName,
                phone_number: phoneNumber
            })
            .eq("id", id)
            .eq("agent_creator_id", ownerId)
            .contains("roles", ["agent"])
            .select()
            .single()

        if (updateError || !updatedProfile) {
            return NextResponse.json(
                { error: updateError?.message || "Failed to update agent profile" },
                { status: 400 }
            )
        }

        await supabaseAdmin.auth.admin.updateUserById(id, {
            user_metadata: {
                full_name: fullName,
                phone_number: phoneNumber
            }
        })

        const normalized = normalizeData(updatedProfile)

        return NextResponse.json({
            data: normalized,
            message: "Agent updated successfully"
        })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error)?.message || "Internal server error" },
            { status: 500 }
        )
    }
}

export const DELETE = async (req: Request) => {
    try {
        const ownerId = await getAuthUser(req)
        if (!ownerId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { id } = await req.json()

        if (!id) {
            return NextResponse.json(
                { error: "Agent ID is required" },
                { status: 400 }
            )
        }

        const { data: existingAgent } = await supabaseAdmin
            .from("profiles")
            .select("roles")
            .eq("id", id)
            .eq("agent_creator_id", ownerId)
            .single()

        if (!existingAgent) {
            return NextResponse.json(
                { error: "Agent not found or unauthorized" },
                { status: 404 }
            )
        }

        const { error: deleteProfileError } = await supabaseAdmin
            .from("profiles")
            .delete()
            .eq("id", id)
            .eq("agent_creator_id", ownerId)

        if (deleteProfileError) {
            return NextResponse.json(
                { error: deleteProfileError.message },
                { status: 500 }
            )
        }

        await supabaseAdmin.auth.admin.deleteUser(id)

        return NextResponse.json({
            message: "Agent deleted successfully"
        })
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error)?.message || "Internal server error" },
            { status: 500 }
        )
    }
}
