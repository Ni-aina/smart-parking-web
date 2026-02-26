import { ChevronDown, ChevronUp } from "lucide-react";

const Order = () => {
    return (  
        <div role="button" className="flex flex-col gap-0 cursor-pointer hover:opacity-80 text-white">
            <ChevronUp
                size={12}
            />
            <ChevronDown
                size={12}
                className="-mt-0.75"
            />
        </div>
    )
}
 
export default Order;