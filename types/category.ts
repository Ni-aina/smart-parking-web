export interface VehicleCategoryTranslationRowInterface {
    id: string;
    category_id: number | null;
    language_code: string;
    display_label: string;
    description: string | null;
}

export interface VehicleCategoryRowInterface {
    id: string;
    category_code: string;
    max_weight_kg: number | null;
    max_height_meters: number | null;
    created_at: string | null;
    translations: VehicleCategoryTranslationRowInterface[];
}

export interface VehicleCategoryTranslationInterface {
    id: string;
    categoryId: number | null;
    languageCode: string;
    displayLabel: string;
    description: string | null;
}

export interface VehicleCategoryInterface {
    id: string;
    categoryCode: string;
    maxWeightKg: number | null;
    maxHeightMeters: number | null;
    createdAt: string | null;
    displayLabel: string;
    description: string | null;
    translations: VehicleCategoryTranslationInterface[];
}