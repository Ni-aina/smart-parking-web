"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getServerAuth(): Promise<{
    supabase:  any,
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