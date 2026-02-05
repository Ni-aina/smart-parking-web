"use client";

import { cn } from "@/lib/utils";
import { Loader2, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface CustomButtonInterface {
    title: string;
    isPending?: boolean;
    onClick?: ([...args]: any) => void;
    type?: "submit" | "button",
    className?: string,
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> 
    & RefAttributes<SVGSVGElement>>
}

const CustomButton = ({
    title,
    isPending,
    onClick,
    type = "submit",
    className,
    Icon
}: CustomButtonInterface) => {
    return (
        <button
            className={cn(`px-4 py-2 flex justify-center items-center gap-2
            bg-blue-950/15 rounded-sm cursor-pointer hover:opacity-80
            disabled:cursor-not-allowed disabled:opacity-80`, className)}
            disabled={isPending}
            onClick={onClick}
            type={type}
        >
            {
                isPending ?
                <Loader2
                    size={16}
                    className="animate-spin"
                />
                :
                <Icon
                    size={16}
                />
            }
            {title}
        </button>
    )
}

export default CustomButton;