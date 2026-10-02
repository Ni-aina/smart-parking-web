import { VehicleCategoryInterface } from "@/types/category";
import { AgentsInterface } from "./profile";

export interface LotInterface {
    id: string,
    name: string,
    location: string,
    locationLat: number,
    locationLng: number,
    createdAt: string,
    totalSpots: number,
    occupiedSpots: number,
    pricePerHour: number,
    urlImages: string[],
    categoryId: string,
    category: VehicleCategoryInterface | null,
    agents: string[],
    distanceM: number,
    totalLots: number
}

export interface LotFormInterface {
    id?: string;
    name: string;
    location: string;
    categoryId: string;
    totalSpots: number | string;
    pricePerHour: number | string;
    agents: AgentsInterface[];
    images: File[];
    location_lat: number | null;
    location_lng: number | null;
}