import { supabase } from "@/lib/supabase/client";
import { LotInterface } from "@/types/lot";
import { ReservationToolInterface } from "@/types/reservation";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function getParkingLots(
    params: {
        searchTerm?: string;
        filters?: {
            type?: string;
            priceRange?: [number, number];
        }
        location?: {
            latitude: number | null;
            longitude: number | null;
        }
        pagination?: {
            page: number;
            limit: number;
        }
    } = {}): Promise<{
        data: LotInterface[];
        hasMore: boolean;
        nextPage?: number;
    }> {
    try {

        const {
            searchTerm = "",
            filters = {},
            location = {
                latitude: null,
                longitude: null
            },
            pagination = {
                page: 1,
                limit: 20
            }
        } = params;

        const request = (async () => {

            const { data: parkings, error } = await supabase.rpc(
                "get_parking_lots_advanced",
                {
                    search_term: searchTerm,
                    type_filter: filters.type ?? null,
                    min_price: filters.priceRange?.[0] ?? 0,
                    max_price: filters.priceRange?.[1] ?? 10000,
                    user_lat: location?.latitude ?? null,
                    user_lng: location?.longitude ?? null,
                    page: pagination.page,
                    limit_count: pagination.limit
                }
            )

            const hasMore = parkings.length * pagination.page < parkings[0]?.total_lots;

            if (!parkings || error) throw new Error(`An error occured during fetching parkings, ${error?.message}`);
            const normalized = parkings.map((item: LotInterface) => normalizeData(item));
            return {
                data: normalized as LotInterface[],
                hasMore,
                nextPage: hasMore ?
                    pagination.page + 1 :
                    undefined
            }
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function createReservationTool(reservation: ReservationToolInterface)
    : Promise<ReservationToolInterface> {
    try {
        const { ...payload } = denormalizeData(reservation);

        const request = (async () => {
            const { data: newReservation, error } = await supabase.from("reservations")
                .insert([payload])
                .select();
            if (!newReservation || error) throw new Error(`An error occured during reservation creation, 
                ${error.message}`)

            return normalizeData(newReservation) as ReservationToolInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}