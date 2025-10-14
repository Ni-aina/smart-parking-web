"use client";

import { ArrowLeftCircle, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const HeaderBack = (
    { 
        title,
        action
     }: { 
        title: string,
        action: "Edit" | "New"
    }
) => {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-3">
                <button
                    title="Go back"
                    className="cursor-pointer hover:opacity-80"
                    onClick={router.back}
                >
                    <ArrowLeftCircle
                        size={24}
                    />
                </button>
                <h1 className="font-semibold">
                    {title}
                </h1>
            </div>
            <div className="flex items-center space-x-2">
                {
                    action === "New" ?
                    <Plus
                        size={20}
                        className="text-red-500"
                    />
                    :
                    <Pencil
                        size={18}
                        className="text-red-500"
                    />
                }
                <h1 className="font-semibold">
                    {action}
                </h1>
            </div>
        </div>
    )
}

export default HeaderBack;