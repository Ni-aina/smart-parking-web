"use server";

import { FormTypeInterface, TypeInterface } from "@/types/type";
import { normalizeData } from "@/utils/normalizeData";
import { revalidatePath } from "next/cache";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createType(formType: FormTypeInterface): Promise<TypeInterface | null> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId: ownerId
            } = await getServerAuth();

            if (!ownerId || !isUUID(ownerId)) return null;

            const { data: newType, error } = await supabase.from("lot_types")
                .insert([{
                    vehicle_type: formType.vehicleType,
                    max_width: formType.maxWidth,
                    max_length: formType.maxLength,
                    max_height: formType.maxHeight,
                    description: formType.description,
                    owner_id: ownerId
                }])
                .select()
                .single();

            if (!newType || error) return null;
            const normalized = normalizeData(newType);

            revalidatePath("/owner/settings/types");
            return normalized as TypeInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function updateType(formType: FormTypeInterface): Promise<TypeInterface | null> {
    try {
        const request = (async () => {
            const { supabase } = await getServerAuth();

            const { id } = formType;
            if (!id) return null;

            const { data: updatedType, error } = await supabase.from("lot_types")
                .update({
                    vehicle_type: formType.vehicleType,
                    max_width: formType.maxWidth,
                    max_length: formType.maxLength,
                    max_height: formType.maxHeight,
                    description: formType.description
                })
                .eq("id", id)
                .select()
                .single();

            if (!updatedType || error) return null;
            const normalized = normalizeData(updatedType);

            revalidatePath("/owner/settings/types");
            return normalized as TypeInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function deleteType(id: string) {
    try {
        const request = (async () => {
            const { supabase } = await getServerAuth();

            if (!id) return;

            const { error } = await supabase.from("lot_types")
                .delete()
                .eq("id", id)

            if (error) return;
            revalidatePath("/owner/settings/types");
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getTypes(): Promise<TypeInterface[]> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId: ownerId
            } = await getServerAuth();

            if (!ownerId || !isUUID(ownerId)) return [];

            const { data: types, error } = await supabase.from("lot_types")
                .select("*")
                .eq("owner_id", ownerId)
                .order("created_at", {
                    ascending: false
                });

            if (!types || error) return [];
            const normalized = types.map((item: any) => normalizeData(item));

            return normalized as TypeInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}