"use server";

import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { ProfileInterface } from "@/types/profile";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { User } from "@supabase/supabase-js";
import { getServerAuth } from "./authServer.action";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { isUUID } from "@/utils/isUUID";
import { PersonalInfoFormInterface } from "@/types/account";
import { ProfileStateInterface } from "@/hooks/useAccountSettings";
import { uploadFile } from "./uploadFile.action";
import { removeFile } from "./removeFile.action";

export async function createProfile(profile: ProfileInterface & { customerId: string })
    : Promise<ProfileInterface> {
    try {
        const {
            createdAt,
            ...rest
        } = profile;

        const normalizedProfile = denormalizeData(rest);

        const request = (async () => {
            const supabase = await createClient();
            
            const { data: newProfile, error } = await supabase.from("profiles")
                .upsert(normalizedProfile, { onConflict: "id" })
                .select("*")
                .single()

            if (!newProfile || error) throw new Error(`The profile cannot be created, ${error?.message}`);
            const normalized = normalizeData(newProfile);

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

export async function getCurrentProfile(user: User | null): Promise<ProfileInterface> {
    try {
        if (!user) throw new Error("Unauthorized");
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

export async function getAgents(
    page: number = 1,
    limit: number = 50,
    searchTerm: string = ""
): Promise<ProfileInterface[]> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId: ownerId
            } = await getServerAuth();

            if (!isUUID(ownerId || "")) throw new Error("Unauthorized");

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data: profiles, error } = await supabase.from("profiles")
                .select("*")
                .contains("roles", ["agent"])
                .eq("agent_creator_id", ownerId)
                .or(`full_name.ilike.%${searchTerm}%,email_address.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
                .order("created_at", {
                    ascending: false
                })
                .range(from, to)

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

interface avatarInterface {
    avatar: File;
    urlImage: string;
}

export async function updateAvatar(
    _previousState: ProfileStateInterface,
    avatars: avatarInterface
): Promise<ProfileStateInterface> {
    const {
        supabase,
        userId
    } = await getServerAuth();

    if (!supabase || !isUUID(userId)) {
        return {
            error: "Unauthorized",
            success: null
        }
    }

    const {
        avatar,
        urlImage
    } = avatars;

    const filePath = urlImage.split("/").slice(-2).join("/");
    const [
        uploadedFileURL
    ] = await Promise.all([
        uploadFile(avatar, "images", "avatars"),
        removeFile(filePath, "images")
    ])

    if (!uploadedFileURL) {
        return {
            error: "The avatar cannot be updated",
            success: null
        }
    }

    const { data: updatedProfile, error } = await supabase.from("profiles")
        .update({ url_image: uploadedFileURL })
        .eq("id", userId)
        .select()
        .single()
        
    if (!updatedProfile || error) {
        return {
            error: `The profile cannot be updated, ${error?.message}`,
            success: null
        }
    }

    return {
        error: null,
        success: "Avatar updated successfully"
    }
}

export async function updateProfile(
    _previousState: ProfileStateInterface,
    profile: PersonalInfoFormInterface
): Promise<ProfileStateInterface> {
    const {
        supabase,
        userId
    } = await getServerAuth();

    if (!supabase || !userId) {
        return {
            error: "Unauthorized",
            success: null
        }
    }

    const profileToUpdate = denormalizeData(profile);
    const {
        full_name,
        phone_number
     } = profileToUpdate;
    
    const { data: updatedProfile, error } = await supabase.from("profiles")
        .update({
            full_name,
            phone_number
        })
        .eq("id", userId)
        .select()
        .single()

    if (!updatedProfile || error) {
        return {
            error: `The profile cannot be updated, ${error?.message}`,
            success: null
        }
    }

    return {
        error: null,
        success: "Profile updated successfully"
    }
}