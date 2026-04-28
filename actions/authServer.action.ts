"use server";

import { ProfileStateInterface } from "@/hooks/useAccountSettings";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getServerAuth(): Promise<{
    supabase: any,
    userId: string
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) return redirect("/auth/sign-out");

    const {
        id
    } = user;

    return {
        supabase,
        userId: id
    }
}

export const updatePassword = async (
    _previousState: ProfileStateInterface,
    passwords: {
        oldPassword: string,
        newPassword: string,
        confirmPassword: string
    }
): Promise<ProfileStateInterface> => {

    const {
        oldPassword,
        newPassword,
        confirmPassword
    } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return {
            success: null,
            error: "Old password, new password and confirm password are required"
        }
    }

    if (oldPassword === newPassword) {
        return {
            success: null,
            error: "Old password and new password must be different"
        }
    }

    if (newPassword !== confirmPassword) {
        return {
            success: null,
            error: "New password and confirm password must be the same"
        }
    }

    const { supabase } = await getServerAuth();

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) return {
        success: null,
        error: error.message
    }

    return {
        success: "Password updated successfully",
        error: null
    }
}