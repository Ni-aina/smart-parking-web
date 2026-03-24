"use client"

import { Inbox, LucideIcon } from "lucide-react"

interface NoDataProps {
    message?: string
    description?: string
    icon?: LucideIcon
    className?: string
    size?: "sm" | "md" | "lg"
}

const NoData = ({
    message = "No data yet",
    description = "There are no items to display at this time.",
    icon: Icon = Inbox,
    className,
    size = "md"
}: NoDataProps) => {
    const sizeClasses = {
        sm: {
            container: "py-8",
            iconSize: 32,
            message: "text-sm",
            description: "text-xs"
        },
        md: {
            container: "py-12",
            iconSize: 48,
            message: "text-base",
            description: "text-sm"
        },
        lg: {
            container: "py-16",
            iconSize: 64,
            message: "text-lg",
            description: "text-base"
        }
    }

    const currentSize = sizeClasses[size]

    return (
        <div 
            className={
                `flex flex-col items-center justify-center w-full h-full
                ${currentSize.container} ${className || ""}`
            }
        >
            <div className="flex flex-col items-center gap-4 text-center max-w-md">
                <Icon 
                    size={currentSize.iconSize}
                    className="text-white/20"
                />
                
                <div className="space-y-2">
                    <h3 
                        className={
                            `font-medium text-white/60 ${currentSize.message}`
                        }
                    >
                        {message}
                    </h3>
                    
                    {
                        description && 
                        <p 
                            className={
                                `text-white/40 ${currentSize.description}`
                            }
                        >
                            {description}
                        </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default NoData
