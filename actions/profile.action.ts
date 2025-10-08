import { supabase } from "@/lib/supabase/client";
import { ProfileInterface } from "@/types/profile";
import { normalizeData } from "@/utils/normalizeData";
import { User } from "@supabase/supabase-js";

export async function getCurrentProfile(user: User|null): Promise<ProfileInterface | null> {
    try {
        if (!user) return null;

        const { id } = user;

        const { data: currentProfile, error } = await supabase.from("profiles")
            .select("*")
            .eq("id", id)
            .single();

        if (!currentProfile || error) throw new Error(`The profile can't be find, ${error?.message}`);
        const normalized = normalizeData(currentProfile);

        return normalized as ProfileInterface;
    } catch {
        return null;
    }
}