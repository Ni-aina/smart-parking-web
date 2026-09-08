interface NominatimReverseResult {
    display_name?: string
}

export const reverseGeocode = async (
    lat: number,
    lng: number
): Promise<string> => {
    try {
        const url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lng
        const response = await fetch(
            url,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        )

        if (!response.ok) {
            return lat.toFixed(6) + ", " + lng.toFixed(6)
        }

        const data: NominatimReverseResult = await response.json()

        return data.display_name || lat.toFixed(6) + ", " + lng.toFixed(6)
    } catch {
        return lat.toFixed(6) + ", " + lng.toFixed(6)
    }
}