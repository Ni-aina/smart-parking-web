export interface ParkingInterface {
    id: string;
    ownerId: string;
    typeId: string;
    name: string;
    location: string;
    totalSpots: number;
    occupiedSpots: number;
    pricePerHour: number;
    agents: string[];
    urlImages: string[];
    createdAt: string;
}