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