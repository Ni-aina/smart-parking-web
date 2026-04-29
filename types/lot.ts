import { ProfileInterface } from "./profile";

export interface DistanceTimeInterface {
    distanceKm: number;
    timeHours: number;
    timeMinutes: number;
    formatted: string;
}

export interface LotInterface {
    id: string;
    ownerId: string;
    owner: ProfileInterface;
    lotType: {
        id: string;
        vehicleType: string;
        description: string;
        maxWidth: number;
        maxLength: number;
        maxHeight: number;
    }
    name: string;
    location: string;
    locationLat: number;
    locationLng: number;
    totalSpots: number;
    occupiedSpots: number;
    pricePerHour: number;
    agents: string[];
    urlImages: string[];
    createdAt: string;
    distance?: DistanceTimeInterface;
    distanceM?: number;
    totalLots: number;
}