import { Loader } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex justify-center items-center w-full h-full bg-slate-950">
            <Loader
                size={24}
                color="white"
            />
        </div>
    )
}

export default Loading;