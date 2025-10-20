import { supabase } from "@/lib/supabase/client";
import { ProfileInterface } from "@/types/profile";
import { normalizeData } from "@/utils/normalizeData";
import { User } from "@supabase/supabase-js";
import { getServerAuth } from "./authServer.action";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function getCurrentProfile(user: User | null): Promise<ProfileInterface | null> {
    try {
        if (!user) return null;
        const { id } = user;

        const request = (async () => {
            const { data: currentProfile, error } = await supabase.from("profiles")
                .select("*")
                .eq("id", id)
                .single();

            if (!currentProfile || error) throw new Error(`The profile can't be find, ${error?.message}`);
            const normalized = normalizeData(currentProfile);

            return normalized as ProfileInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getProfiles(): Promise<ProfileInterface[]> {
    try {
        const request = (async () => {
            const { data: profiles, error } = await supabase.from("profiles")
                .select("*")
                .order("created_at", {
                    ascending: false
                })

            if (!profiles || error) throw new Error(`The profile can't be find, ${error?.message}`);
            const normalized = profiles.map(item => normalizeData(item))

            return normalized as ProfileInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}


export async function getAgents(): Promise<ProfileInterface[]> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId: ownerId
            } = await getServerAuth();

            const { data: profiles, error } = await supabase.from("profiles")
                .select("*")
                .contains("roles", ["agent"])
                .eq("agent_creator_id", ownerId)
                .order("created_at", {
                    ascending: false
                })

            if (!profiles || error) throw new Error(`The profile can't be find, ${error?.message}`);
            const normalized = profiles.map((item: any) => normalizeData(item))

            return normalized as ProfileInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}