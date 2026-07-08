"use client"

import { cn } from "@/lib/utils";
import { ProfileInterface } from "@/types/profile";
import Image from "next/image";

const getInitials = (name?: string) =>
    name
        ?.split(" ")
        .slice(0, 2)
        .map(part => part.at(0)?.toUpperCase())
        .join("") || "?"

const Avatar = ({
    profile,
    size = "md"
}: {
    profile?: ProfileInterface
    size?: "sm" | "md" | "lg"
}) => {
    const sizeClass = {
        sm: "h-8 w-8 text-xs",
        md: "h-11 w-11 text-sm",
        lg: "h-12 w-12 text-base"
    }[size]

    if (profile?.urlImage) {
        return (
            <div className={cn("relative shrink-0 overflow-hidden rounded-full", sizeClass)}>
                <Image
                    src={profile.urlImage}
                    alt={profile.fullName || "Profile"}
                    fill
                    sizes="48px"
                    className="object-cover"
                />
            </div>
        )
    }

    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 font-semibold",
                sizeClass
            )}
        >
            {getInitials(profile?.fullName)}
        </div>
    )
}

export default Avatar;
