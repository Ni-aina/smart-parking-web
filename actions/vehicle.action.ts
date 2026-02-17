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