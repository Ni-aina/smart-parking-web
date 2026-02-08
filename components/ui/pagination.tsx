"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
    showPage: number;
    totalCount: number;
}

const Pagination = ({
    showPage,
    totalCount
}: PaginationProps) => {
    const show = showPage < totalCount ? showPage : totalCount;
    const total = show < totalCount ? totalCount : show;

    return (
        <div className="flex flex-wrap justify-between items-center gap-3 text-white/60">
            <h1 className="text-sm">
                1-{show} of {total}
            </h1>
            <div className="flex items-center gap-3">
                <button
                    className="p-2 bg-white/5 rounded-sm cursor-pointer  
                    hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled
                >
                    <ArrowLeft
                        size={18}
                    />
                </button>
                <h1>
                    1
                </h1>
                <button
                    className="p-2 bg-white/5 rounded-sm cursor-pointer 
                    hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <ArrowRight
                        size={18}
                    />
                </button>
            </div>
        </div>
    )
}

export default Pagination;