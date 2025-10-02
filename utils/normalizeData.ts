
export const normalizeData = (data: Record<string, any>) => {
    const normalized: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
        const parts = key.split("_");
        const newKey = parts[0] + parts.slice(1).map(part => 
            part.charAt(0).toUpperCase() +
            part.slice(1)
        ).join("")
        normalized[newKey] = value;
    }
   return normalized;
}