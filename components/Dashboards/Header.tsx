"use client";

import useCurrentProfile from "@/hooks/useCurrentProfile";
import CustomButton from "../ui/customButton";
import { ArrowDown } from "lucide-react";

interface HeaderProps {
    handleExport: ()=> void;
}

const Header = ({
    handleExport
}: HeaderProps) => {
    const { currentProfile } = useCurrentProfile();
    const fullName = currentProfile?.fullName || "";

    return (
        <div className="flex flex-wrap justify-between gap-5">
            <div className="space-y-3">
                <h1 className="text-white text-lg lg:text-3xl font-semibold">
                    Welcome back, {fullName}
                </h1>
                <p className="text-white/60">
                    Measure your reservations traffic
                </p>
            </div>
            <div>
                <CustomButton
                    Icon={ArrowDown}
                    title="Export data"
                    onClick={handleExport}
                />
            </div>
        </div>
    )
}
 
export default Header;