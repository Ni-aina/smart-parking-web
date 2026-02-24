
export const normalizeData = (data: Record<string, any>): Record<string, any> => {
    if (data === null || data === undefined) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => normalizeData(item));
    }

    if (typeof data === 'object') {
        const normalized: Record<string, any> = {};
        
        for (const [key, value] of Object.entries(data)) {
            const parts = key.split("_");
            const newKey = parts[0] + parts.slice(1).map(part => 
                part.charAt(0).toUpperCase() + part.slice(1)
            ).join("");
            
            normalized[newKey] = normalizeData(value);
        }
        
        return normalized;
    }

    return data;
}

export const denormalizeData = (data: Record<string, any>): Record<string, any> => {
    if (data === null || data === undefined) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => denormalizeData(item));
    }

    if (typeof data === 'object') {
        const denormalized: Record<string, any> = {};
        
        for (const [key, value] of Object.entries(data)) {
            const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            denormalized[newKey] = denormalizeData(value);
        }
        
        return denormalized;
    }

    return data;
}