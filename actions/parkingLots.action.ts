"use server";

import { createClient } from "@/lib/supabase/server";
import { ParkingInterface } from "@/types/parking";
import { normalizeData } from "@/utils/normalizeData";

export async function getParkingById(parkingId: string): Promise<ParkingInterface|null> {
    const supabase = await createClient();

    const { data: parking, error } = await supabase.from("parking_lots")
    .select("*")
    .eq("id", parkingId)
    .single();

    if (!parking || error) return null;
    const normalized = normalizeData(parking);
    return normalized as ParkingInterface;
}