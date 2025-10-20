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