import { Loader } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <Loader
                size={24}
                color="white"
                className="animate-spin"
            />
        </div>
    )
}

export default Loading;