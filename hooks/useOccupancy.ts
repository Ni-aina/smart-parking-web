import { checkLotByTime } from "@/actions/parkingLots.action";
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
        isLoading
    } = useQuery({
        queryKey: [`check-lot-availability-${lotId}-${startTime}-${endTime}`],
        queryFn: () => checkLotByTime(lotId, startTime, endTime)
    })

    return {
        availableSpots,
        isLoading
    }
}

export default useOccupancy;