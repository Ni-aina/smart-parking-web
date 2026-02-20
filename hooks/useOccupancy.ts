"use client";

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
            const res = await fetch("/api/check-lot", {
                method: "POST",
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