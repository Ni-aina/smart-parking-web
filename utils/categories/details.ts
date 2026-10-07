import { VehicleCategoryInterface } from "@/types/category";

export const getCategoryText = (
    category: VehicleCategoryInterface | null,
    language: string,
    t: (key: string) => string
): string => {
    if (!category) return "—"

    const translation = category.translations.find(row => row.languageCode === language) ?? category.translations[0]
    const label = translation?.displayLabel ?? category.categoryCode

    return `${label}, ${t("parkingLots.form.maxWeightTonnes")}: ${category.maxWeightTonnes ?? t("parkingLots.form.notSpecified")} ${t("parkingLots.form.maxHeightMeters")}: ${category.maxHeightMeters ?? t("parkingLots.form.notSpecified")}`
}