import { Skeleton } from "./skeleton";

const LoadingSkeleton = () => {
    return (
        <div className="w-full h-full flex lg:justify-center flex-col gap-5">
            <Skeleton
                className="w-3/4 h-25 bg-black/20"
            />
            <Skeleton
                className="w-full h-30 bg-black/20"
            />
            <Skeleton
                className="w-2/3 h-10 bg-black/20"
            />
            <Skeleton
                className="w-1/2 h-20 bg-black/20"
            />
        </div>
    )
}

export default LoadingSkeleton;