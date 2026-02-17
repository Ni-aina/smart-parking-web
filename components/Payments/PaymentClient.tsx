"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PaymentInterface } from "@/types/payment";
import PaymentTable from "./PaymentTable";

interface PaymentClientProps {
    payments: PaymentInterface[];
    count: number;
}

const title = "Payments";

const PaymentClient = ({
    payments,
    count
}: PaymentClientProps) => {
    const [search, setSearch] = useState<string>("");

    return (
        <div className="flex flex-col gap-5">
            <div
                className="flex flex-wrap justify-between items-center text-white gap-5 
                bg-white/5 backdrop-blur-md rounded-lg px-6 py-4"
            >
                <h1 className="text-lg font-semibold tracking-wide">Payment History</h1>
                <div
                    className="flex items-center bg-white/5 backdrop-blur-sm border 
                    border-white/5 rounded-lg px-4 py-2 gap-2"
                >
                    <Search size={14} className="text-white/60" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent placeholder:text-white/40"
                        placeholder={`Search for ${title.toLowerCase()}...`}
                    />
                </div>
            </div>
            <PaymentTable
                title={title}
                payments={payments}
                count={count}
            />
        </div>
    )
}

export default PaymentClient;
