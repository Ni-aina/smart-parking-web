import { supabase } from "@/lib/supabase/client";
import { ProfileInterface } from "@/types/profile";
import { normalizeData } from "@/utils/normalizeData";
import { User } from "@supabase/supabase-js";
import { getServerAuth } from "./authServer.action";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { isUUID } from "@/utils/isUUID";

export async function getCurrentProfile(user: User | null): Promise<ProfileInterface | null> {
    try {
        if (!user) return null;
        const { id } = user;

        const request = (async () => {
            const { data: currentProfile, error } = await supabase.from("profiles")
                .select("*")
                .eq("id", id)
                .single();

            if (!currentProfile || error) throw new Error(`The profile cannot be find, ${error?.message}`);
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

            if (!profiles || error) throw new Error(`The profile cannot be find, ${error?.message}`);
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

            if (!isUUID(ownerId || "")) return [];

            const { data: profiles, error } = await supabase.from("profiles")
                .select("*")
                .contains("roles", ["agent"])
                .eq("agent_creator_id", ownerId)
                .order("created_at", {
                    ascending: false
                })

            if (!profiles || error) throw new Error(`The profile cannot be find, ${error?.message}`);
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

export async function getDrivers(
    searchTerm: string = ""
): Promise<ProfileInterface[]> {
    try {
        const request = (async () => {
            const { data: profiles, error } = await supabase.from("profiles")
                .select("*")
                .contains("roles", ["driver"])
                .ilike("full_name", `%${searchTerm}%`)
                .order("created_at", {
                    ascending: false
                })
                .limit(100)

            if (!profiles || error) throw new Error(`The profile cannot be find, ${error?.message}`);
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