"use server";

import { FormTypeInterface, TypeInterface } from "@/types/type";
import { normalizeData } from "@/utils/normalizeData";
import { revalidatePath } from "next/cache";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createType(formType: FormTypeInterface): Promise<TypeInterface> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId: ownerId
            } = await getServerAuth();

            if (!ownerId || !isUUID(ownerId)) throw new Error("Unauthorized");

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

            if (!newType || error) throw new Error(error.message || "Failed to create type");
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

export async function updateType(formType: FormTypeInterface): Promise<TypeInterface> {
    try {
        const request = (async () => {
            const { supabase } = await getServerAuth();

            const { id } = formType;
            if (!id) throw new Error("Type ID is required");

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

            if (!updatedType || error) throw new Error(error.message || "Failed to update type");
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

            if (!id) throw new Error("Type ID is required");

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

export async function getTypes(
    page = 1,
    limit = 20,
    searchTerm = ""
): Promise<TypeInterface[] & { count: number }> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId: ownerId
            } = await getServerAuth();

            const from = (page - 1) * limit;
            const to = from + (limit - 1);

            if (!ownerId || !isUUID(ownerId)) throw new Error("Unauthorized");

            const [
                { count },
                { data: types, error }
            ] = await Promise.all([
                supabase.from("lot_types")
                    .select("*", { count: "exact" })
                    .eq("owner_id", ownerId),
                supabase.from("lot_types")
                    .select("*")
                    .eq("owner_id", ownerId)
                    .or(`vehicle_type.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
                    .order("created_at", {
                        ascending: false
                    })
                    .range(from, to)
            ])

            if (!types || error) throw new Error(error.message || "Failed to fetch types");

            const normalized = types.map((item: any) => normalizeData(item));

            return Object.assign(normalized, { count })
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function checkVehicleSpace(
    lotId: string,
    vehicleId: string
): Promise<boolean> {
    try {
        const request = (async () => {
            const { supabase } = await getServerAuth();

            if (!lotId) throw new Error("Lot ID is required");
            if (!vehicleId) throw new Error("Vehicle ID is required");

            const [
                { data: types, error: typesError },
                { data: vehicle, error: vehicleError }
            ] = await Promise.all([
                supabase.from("parking_lots")
                    .select("type:type_id(max_width, max_height, max_length)")
                    .eq("id", lotId),
                supabase.from("vehicles")
                    .select("width, height, length")
                    .eq("id", vehicleId)
            ])

            if (!types || typesError) throw new Error(`Failed to check vehicle space, ${typesError?.message}`);
            if (!vehicle || vehicleError) throw new Error(`Failed to check vehicle space, ${vehicleError?.message}`);
            
            const [
                {
                    type: {
                        max_width,
                        max_height,
                        max_length
                    }
                }
            ] = types;

            const [
                { 
                    width, 
                    length,
                    height
                }
            ] = vehicle;

            if (width > max_width) throw new Error(`Vehicle width exceeds maximum width of ${max_width}`);
            if (length > max_length) throw new Error(`Vehicle length exceeds maximum length of ${max_length}`);
            if (height > max_height) throw new Error(`Vehicle height exceeds maximum height of ${max_height}`);
            
            return true;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}