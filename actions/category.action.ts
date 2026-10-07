"use server";

import {
    VehicleCategoryInterface,
    VehicleCategoryRowInterface
} from "@/types/category";
import { getServerAuth } from "./authServer.action";
import { rejectTimeout } from "@/utils/rejectTimeout";

const SELECT_QUERY = "*, translations: vehicle_category_translations(id, category_id, language_code, display_label, description)";

const mapVehicleCategory = (item: VehicleCategoryRowInterface): VehicleCategoryInterface => {
    const [translation] = item.translations ?? [];

    return {
        id: item.id,
        categoryCode: item.category_code,
        maxWeightTonnes: item.max_weight_tonnes,
        maxHeightMeters: item.max_height_meters,
        createdAt: item.created_at,
        displayLabel: translation?.display_label ?? item.category_code,
        description: translation?.description ?? null,
        translations: (item.translations ?? []).map(row => {
            return {
                id: row.id,
                categoryId: row.category_id,
                languageCode: row.language_code,
                displayLabel: row.display_label,
                description: row.description
            }
        })
    }
}

export const getVehicleCategories = async (languageCode = "en")
    : Promise<VehicleCategoryInterface[]> => {
    try {
        const request = (async () => {
            const { supabase } = await getServerAuth();

            const { data: categories, error } = await supabase
                .from("vehicle_categories")
                .select(SELECT_QUERY)
                .eq("translations.language_code", languageCode)
                .order("id", {
                    ascending: true
                })

            if (!categories || error) return [];

            return (categories as VehicleCategoryRowInterface[]).map(mapVehicleCategory)
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}