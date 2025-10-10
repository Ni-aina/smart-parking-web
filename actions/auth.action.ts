"use server";

import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { AuthUserInterface } from "@/types/auth";

export async function logIn(email: string, password: string):
    Promise<AuthUserInterface> {
    const { data } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    return data;
}

export async function logOut() {
    await supabase.auth.signOut();
}

export async function getServerAuth(): Promise<{
    supabase:  any,
    userId: string|null
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        supabase,
        userId: null
    }
    const {
        id
    } = user;

    return {
        supabase,
        userId: id
    }
}