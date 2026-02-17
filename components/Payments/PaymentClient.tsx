"use client";

import { useState } from "react";
import Navbar from "../Navbar";
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
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={() => {}}
            />
            <PaymentTable
                title={title}
                payments={payments}
                count={count}
            />
        </div>
    )
}

export default PaymentClient;
