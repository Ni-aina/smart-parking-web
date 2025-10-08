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

    console.log(error);

    if (!newType || error) return null;
    const normalized = normalizeData(newType);

    revalidatePath("/admin/settings/types");
    return normalized as TypeInterface;
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