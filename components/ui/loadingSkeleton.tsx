import { Skeleton } from "./skeleton";

const LoadingSkeleton = () => {
    return (
        <div className="w-full h-full flex lg:justify-center flex-col gap-6">
            <Skeleton
                className="w-3/4 h-20 bg-white/10"
            />
            <Skeleton
                className="w-full h-15 bg-white/10"
            />
            <Skeleton
                className="w-2/3 h-20 bg-white/10"
            />
            <Skeleton
                className="w-4/5 h-10 bg-white/10"
            />
            <Skeleton
                className="w-1/2 h-15 bg-white/10"
            />
        </div>
    )
}

export default LoadingSkeleton;