import { supabase } from "@/lib/supabase/client";
import { AuthUserInterface } from "@/types/auth";
import { rejectTimeout } from "@/utils/rejectTimeout";

export const logIn = async (email: string, password: string): Promise<AuthUserInterface> => {
    try {
        const request = (async () => {
            const { data } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            return data
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error
    }
}

export const resetPassword = async (email: string): Promise<void> => {
    try {
        const request = (async () => {
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("*")
                .eq("email_address", email)
                .single()

            if (!existingProfile) throw new Error()

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            })

            if (error) throw error
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error
    }
}

export const confirmResetPassword = async (password: string): Promise<void> => {
    try {
        const request = (async () => {
            const { error } = await supabase.auth.updateUser({
                password
            })

            if (error) throw error
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error
    }
}

export const logOut = async () => {
    try {
        await supabase.auth.signOut()
    } catch (error) {
        throw error
    }
}