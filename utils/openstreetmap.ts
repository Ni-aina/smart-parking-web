export async function getLatLng(address: string) {
    try {
        const mapURL = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`;
        const mapResponse = await fetch(mapURL);
        
        if (mapResponse.status !== 200)
            throw new Error(`${mapResponse.status}`);
        
        const data = await mapResponse.json();
        
        const { lat, lon } = data[0];

        return {
            latitude: Number.parseFloat(lat),
            longitude: Number.parseFloat(lon)
        }
        
    } catch (error) {
        return {
            latitude: null,
            longitude: null
        }
    }
}

export function getDistance(
    lat1: number|undefined, 
    lon1: number|undefined,
    lat2: number|undefined, 
    lon2: number|undefined
){

    if (
        !lat1 ||
        !lat2 ||
        !lon1 ||
        !lon2
    ) return;

    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }