"use server";

import { createClient } from "@/lib/supabase/server";
import { FormTypeInterface, TypeInterface } from "@/types/type";
import { normalizeData } from "@/utils/normalizeData";
import { revalidatePath } from "next/cache";

export async function createType(type: FormTypeInterface): Promise<TypeInterface | null> {
    const supabase = await createClient();

    const { data: newType, error } = await supabase.from("vehicle_types")
        .insert([{
            ...type
        }])
        .select()
        .single();

    if (!newType || error) return null;
    const normalized = normalizeData(newType);

    revalidatePath("/admin/settings/types");
    return normalized as TypeInterface;
}

export async function updateType(type: FormTypeInterface): Promise<TypeInterface | null> {
    const supabase = await createClient();

    const { id } = type;
    if (!id) return null;

    const { data: updatedType, error } = await supabase.from("vehicle_types")
        .update([{
            ...type
        }])
        .eq("id", id)
        .select()
        .single();

    if (!updatedType || error) return null;
    const normalized = normalizeData(updatedType);

    revalidatePath("/admin/settings/types");
    return normalized as TypeInterface;
}

export async function deleteType(id: string) {
    const supabase = await createClient();

    if (!id) return;

    const { error } = await supabase.from("vehicle_types")
        .delete()
        .eq("id", id)

    if (error) return;
    revalidatePath("/admin/settings/types");
}

export async function getTypes(): Promise<TypeInterface[]> {
    const supabase = await createClient();

    const { data: types, error } = await supabase.from("vehicle_types")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (!types || error) return [];
    const normalized = types.map(item => normalizeData(item));

    return normalized as TypeInterface[];
}