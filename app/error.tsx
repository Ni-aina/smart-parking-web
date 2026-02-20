"use client";

import CustomButton from "@/components/ui/customButton";
import { RefreshCw } from "lucide-react";

const ErrorPage = () => {

    return (
        <div 
           className="flex items-center justify-center h-dvh bg-black/95"
        >
            <div className="text-center space-y-6 px-4">
                <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
                <p className="text-2xl font-semibold text-white">Something went wrong</p>
                <p className="text-gray-300 max-w-md mx-auto">
                    We're sorry for the inconvenience. 
                    Please try refreshing the page or contact support.
                </p>
                <div className="flex justify-center">
                    <CustomButton
                        Icon={RefreshCw}
                        title="Refresh"
                        onClick={() => window.location.reload()}
                    />
                </div>
            </div>
        </div>
    )
}

export default ErrorPage;