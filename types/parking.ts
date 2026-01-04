import { AgentsInterface } from "./profile";

export interface ParkingInterface {
    id: string;
    ownerId: string;
    lotType: {
        id: string;
        vehicleType: string;
    };
    name: string;
    location: string;
    totalSpots: number;
    occupiedSpots: number;
    pricePerHour: number;
    agents: string[];
    urlImages: string[];
    createdAt: string;
}

export interface ParkingFormInterface {
    id?: string;
    name: string;
    location: string;
    typeId: string;
    totalSpots: number | string;
    pricePerHour: number | string;
    agents: AgentsInterface[];
    images: File[];
    location_lat: number | null;
    location_lng: number | null;
}