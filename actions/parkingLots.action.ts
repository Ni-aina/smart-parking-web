"use server";

import { createClient } from "@/lib/supabase/server";
import { ParkingFormInterface, ParkingInterface } from "@/types/parking";
import { normalizeData } from "@/utils/normalizeData";
import { getServerAuth } from "./auth.action";
import { isUUID } from "@/utils/isUUID";
import { uploadFile } from "./uploadFile.action";
import { removeFile } from "./removeFile.action";

export async function createParkingLot(parking: ParkingFormInterface): Promise<ParkingInterface | null> {

    const {
        supabase,
        userId
    } = await getServerAuth();

    if (!userId || !isUUID(userId)) return null;

    const {
        name,
        location,
        typeId: type_id,
        totalSpots: total_spots,
        pricePerHour: price_per_hour,
        images,
        agents,
        location_lat,
        location_lng
    } = parking;

    const urlImages = await Promise.all(images.map(item => uploadFile(item, "images", "parking-lots")));

    if (urlImages.includes(null)) {
        await Promise.all(urlImages.map((item) => {
            if (item) {
                const filePath = item.split("/").slice(-2).join("/");
                removeFile(filePath, "images")
            }
        }));
        return null;
    }

    const { data: newParking, error } = await supabase.from("parking_lots")
        .insert([{
            name,
            location,
            type_id,
            total_spots,
            price_per_hour,
            agents: agents.filter(item => item.checked).map(item => item.id),
            url_images: urlImages,
            location_lat,
            location_lng,
            owner_id: userId
        }])
        .select("*")
        .single()

    if (!newParking || error) {
        await Promise.all(urlImages.map((item) => {
            if (item) {
                const filePath = item.split("/").slice(-2).join("/");
                removeFile(filePath, "images")
            }
        }));
        return null;
    }

    const normalized = normalizeData(newParking);
    return normalized as ParkingInterface;
}

export async function getParkingById(parkingId: string): Promise<ParkingInterface | null> {
    const supabase = await createClient();

    const { data: parking, error } = await supabase.from("parking_lots")
        .select("*")
        .eq("id", parkingId)
        .single();

    if (!parking || error) return null;
    const normalized = normalizeData(parking);
    return normalized as ParkingInterface;
}