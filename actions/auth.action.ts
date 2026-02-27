import { supabase } from "@/lib/supabase/client";
import { AuthUserInterface } from "@/types/auth";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function logIn(email: string, password: string):
    Promise<AuthUserInterface> {
    try {
        const request = (async () => {
            const { data } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            return data;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function resetPassword(email: string): Promise<void> {
    try {
        const request = (async () => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            })

            if (error) throw error;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function logOut() {
    try {
        const request = (async () => {
            await supabase.auth.signOut();

            sessionStorage.clear();

            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
            })
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}