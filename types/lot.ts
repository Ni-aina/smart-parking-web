export interface LotInterface {
    id: number,
    name: string,
    location: string,
    locationLat: number,
    locationLng: number,
    createdAt: string,
    totalSpots: number,
    occupiedSpots: number,
    pricePerHour: number,
    urlImages: string[],
    typeId: number,
    distanceM: number,
    totalLots: number
}