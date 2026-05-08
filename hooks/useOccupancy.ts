"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface useOccupancyProps {
    lotId: string;
    startTime: Date;
    endTime: Date;
}

const useOccupancy = ({
    lotId,
    startTime,
    endTime
}: useOccupancyProps) => {

    const {
        data: availableSpots = 0,
        isLoading,
        error
    } = useQuery({
        queryKey: ["check-lot-availability", lotId, startTime, endTime],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            const res = await fetch("/api/protected/check-lot", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    lotId,
                    startTime,
                    endTime
                })
            })

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            const { data } = await res.json();
            return data;
        }
    })

    return {
        availableSpots,
        isLoading,
        error
    }
}

export default useOccupancy;