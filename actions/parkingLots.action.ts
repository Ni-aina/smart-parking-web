"use server";

import { ParkingFormInterface, ParkingInterface } from "@/types/parking";
import { normalizeData } from "@/utils/normalizeData";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { uploadFile } from "./uploadFile.action";
import { removeFile } from "./removeFile.action";
import { revalidatePath } from "next/cache";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { keyFilter } from "@/types/global";
import { getFilterDates } from "@/utils/DateTimeFilter";

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
            rejectTimeout()
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
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function deleteParking(parkingId: string) {
    try {

        const request = (async () => {
            const { supabase } = await getServerAuth();

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
            const { supabase } = await getServerAuth();

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

export async function getParkingLots(
    page = 1,
    limit = 20,
    searchTerm?: string
): Promise<ParkingInterface[] & { count: number }> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId
            } = await getServerAuth();

            const { data: parkings, error } = await supabase.rpc(
                "get_owner_parking_lots",
                {
                    page,
                    limit_count: limit,
                    search_term: searchTerm,
                    owner_id: userId
                }
            )

            if (!parkings || error) return [];

            const normalized = parkings.map((item: any) => normalizeData(item));
            const count = normalized.at(0).totalLots;

            return Object.assign(normalized, { count });
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getAllParkingLotsForOwner()
    : Promise<ParkingInterface[]> {
    try {
        const request = (async () => {
            const { supabase, userId } = await getServerAuth();

            if (!userId || !isUUID(userId)) return [];

            const { data: parkings, error } = await supabase
                .from("parking_lots")
                .select("*, lotType: type_id(id, vehicle_type)")
                .eq("owner_id", userId)
                .order("name", { ascending: true });

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

export async function getOccupancyLots(filter: keyFilter): Promise<{
    occupiedSpots: number;
    availableSpots: number;
    totalSpots: number;
}> {
    try {
        const request = (async () => {
            const {
                supabase,
                userId
            } = await getServerAuth();

            const { firstDay } = getFilterDates(filter);

            const [
                {
                    count: occupiedSpots,
                    error: reservationsError
                },
                {
                    data: lotsData,
                    error: lotsError
                }
            ] = await Promise.all([
                supabase.from("reservations")
                    .select("lot:lot_id!inner(owner_id)", { count: "exact" })
                    .eq("lot.owner_id", userId)
                    .eq("status", "active")
                    .gte("created_at", firstDay.toISOString()),
                supabase.from("parking_lots")
                    .select("total_spots")
                    .eq("owner_id", userId)
            ])

            if (reservationsError) throw reservationsError;
            if (lotsError) throw lotsError;

            const totalSpots = lotsData.reduce((acc: number, item: any) => {
                return acc + item.total_spots;
            }, 0);

            const availableSpots = totalSpots - occupiedSpots;

            return { 
                occupiedSpots, 
                availableSpots,
                totalSpots
            }
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}