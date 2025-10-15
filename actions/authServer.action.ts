"use server";

import { createClient } from "@/lib/supabase/server";

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