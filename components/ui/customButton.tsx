"use client";

import { Loader2, Upload } from "lucide-react";

interface CustomButtonInterface {
    title: string;
    isPending: boolean;
    onClick?: ([...args]: any) => void;
    type?: "submit" | "button"
}

const CustomButton = ({
    title,
    isPending,
    onClick,
    type = "submit"
}: CustomButtonInterface) => {
    return (
        <button
            className="px-4 py-2 flex justify-center items-center gap-2
            bg-blue-950/20 rounded-sm cursor-pointer hover:opacity-80
            disabled:cursor-not-allowed disabled:opacity-80"
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
                <Upload
                    size={16}
                />
            }
            {title}
        </button>
    )
}

export default CustomButton;