"use server";

import { createClient } from "@/lib/supabase/server";
import { ParkingFormInterface, ParkingInterface } from "@/types/parking";
import { normalizeData } from "@/utils/normalizeData";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { uploadFile } from "./uploadFile.action";
import { removeFile } from "./removeFile.action";
import { revalidatePath } from "next/cache";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createParkingLot(parking: ParkingFormInterface)
    : Promise<ParkingInterface | null> {
    try {
        const request = (async () => {
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
        })()

        return Promise.race([
            request,
            rejectTimeout(1000 * 60)
        ])
    } catch (error) {
        throw error;
    }

}

export async function editParkingLot(parking: ParkingFormInterface, currentUrlImages: string[])
    : Promise<ParkingInterface | null> {
    try {
        const request = (async () => {

            const {
                supabase,
                userId
            } = await getServerAuth();

            const {
                id,
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

            if (!userId || !isUUID(userId) || !id) return null;

            const [_, ...newUrlImages] = await Promise.all([
                currentUrlImages.map((item) => {
                    if (item) {
                        const filePath = item.split("/").slice(-2).join("/");
                        removeFile(filePath, "images")
                    }
                }),
                ...images.map(item => uploadFile(item, "images", "parking-lots"))
            ])

            if (newUrlImages.includes(null)) {
                await Promise.all(newUrlImages.map((item) => {
                    if (item) {
                        const filePath = item.split("/").slice(-2).join("/");
                        removeFile(filePath, "images")
                    }
                }));
                return null;
            }

            const { data: updatedParking, error } = await supabase.from("parking_lots")
                .update({
                    name,
                    location,
                    type_id,
                    total_spots,
                    price_per_hour,
                    agents: agents.filter(item => item.checked).map(item => item.id),
                    url_images: newUrlImages,
                    location_lat,
                    location_lng,
                    owner_id: userId
                })
                .eq("id", id)
                .select("*")
                .single()

            if (!updatedParking || error) {
                await Promise.all(newUrlImages.map((item) => {
                    if (item) {
                        const filePath = item.split("/").slice(-2).join("/");
                        removeFile(filePath, "images")
                    }
                }));
                return null;
            }

            const normalized = normalizeData(updatedParking);
            return normalized as ParkingInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout(1000 * 60)
        ])
    } catch (error) {
        throw error;
    }
}

export async function deleteParking(parkingId: string) {
    try {

        const request = (async () => {
            const supabase = await createClient();

            const { data: parking } = await supabase.from("parking_lots")
                .select("id, url_images")
                .eq("id", parkingId)
                .single()

            if (!parking) return;

            const {
                url_images
            } = parking;

            await Promise.all(url_images.map((item: string) => {
                if (item) {
                    const filePath = item.split("/").slice(-2).join("/");
                    removeFile(filePath, "images")
                }
            }))

            const { error } = await supabase.from("parking_lots")
                .delete()
                .eq("id", parkingId)
                .single();

            if (error) return;
            revalidatePath("/owner/parking-lots");
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getParkingById(parkingId: string): Promise<ParkingInterface | null> {
    try {
        const request = (async () => {
            const supabase = await createClient();

            const { data: parking, error } = await supabase.from("parking_lots")
                .select("*, lotType: type_id(id, vehicle_type)")
                .eq("id", parkingId)
                .single();

            if (!parking || error) return null;
            const normalized = normalizeData(parking);
            return normalized as ParkingInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getParkingLots(): Promise<ParkingInterface[]> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId
            } = await getServerAuth();

            const { data: parkings, error } = await supabase.from("parking_lots")
                .select("*, lotType: type_id(id, vehicle_type)")
                .eq("owner_id", userId)
                .order("created_at", {
                    ascending: false
                });

            if (!parkings || error) return [];
            const normalized = parkings.map((item: any) => normalizeData(item));
            return normalized as ParkingInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}