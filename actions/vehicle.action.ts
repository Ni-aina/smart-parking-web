"use server";

import { VehicleInterface } from "@/types/vehicle";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { normalizeData } from "@/utils/normalizeData";

export async function getVehiclesByDriverId(driverId: string)
    : Promise<VehicleInterface[]> {
    try {
        if (!isUUID(driverId)) throw new Error("Invalid driver ID");

        const request = (async () => {
            const { supabase } = await getServerAuth();

            const { data: vehicles, error } = await supabase
                .from("vehicles")
                .select("*")
                .eq("driver_id", driverId)
                .order("created_at", { ascending: false });

            if (error) throw new Error(`Vehicles fetching error, ${error.message}`);

            const normalized = (vehicles || []).map((item: any) => normalizeData(item));
            return normalized as VehicleInterface[];
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
                { data: lotCategories, error: lotCategoriesError },
                { data: vehicleCategories, error: vehicleCategoriesError }
            ] = await Promise.all([
                supabase.from("parking_lots")
                    .select("category:category_id(max_weight_tonnes, max_height_meters)")
                    .eq("id", lotId),
                supabase.from("vehicles")
                    .select("category:category_id(max_weight_tonnes, max_height_meters)")
                    .eq("id", vehicleId)
            ])

            if (!lotCategories || lotCategoriesError) throw new Error(`Failed to check vehicle space, ${lotCategoriesError?.message}`);
            if (!vehicleCategories || vehicleCategoriesError) throw new Error(`Failed to check vehicle space, ${vehicleCategoriesError?.message}`);

            const [
                {
                    category: {
                        max_weight_tonnes: lot_max_weight,
                        max_height_meters: lot_max_height
                    }
                }
            ] = lotCategories;

            const [
                {
                    category: {
                        max_weight_tonnes: vehicle_max_weight,
                        max_height_meters: vehicle_max_height
                    }
                }
            ] = vehicleCategories;

            if (vehicle_max_weight > lot_max_weight) throw new Error(`Vehicle weight exceeds maximum weight of ${lot_max_weight} tonnes`);
            if (vehicle_max_height > lot_max_height) throw new Error(`Vehicle height exceeds maximum height of ${lot_max_height} meters`);

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