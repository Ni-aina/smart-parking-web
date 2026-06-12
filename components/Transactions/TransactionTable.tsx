"use client";

import { useState } from "react";
import { PaymentInterface } from "@/types/payment";
import { getDateFormat, getTimeFormat } from "@/utils/DateTimeAction";
import Order from "../ui/order";
import InputSelect from "../ui/inputSelect";
import Pagination from "../ui/pagination";
import { PAGINATION } from "@/lib/pagination";
import { SelectInterface } from "@/types/input";
import { useTranslation } from "@/context/LanguageContext";

interface  TransactionTableInterface {
    transactions: PaymentInterface[];
    count: number;
}

interface StatusStylesInterface {
    [key: string]: string;
}

const statusStyles: StatusStylesInterface = {
    succeeded: "text-green-500/70 bg-green-500/10",
    pending: "text-blue-500/70 bg-blue-500/10",
    failed: "text-red-500/70 bg-red-500/10"
}

const TransactionTable = ({
    transactions,
    count
}: TransactionTableInterface) => {
    const { t } = useTranslation();
    const [showPage, setShowPage] = useState("10");

    const headers = [
        t("transactions.headers.driver"),
        t("transactions.headers.parkingLot"),
        t("transactions.headers.amount"),
        t("transactions.headers.method"),
        t("transactions.headers.status"),
        t("transactions.headers.transactionId"),
        t("transactions.headers.date")
    ]

    const handlePaginationChange = (e: SelectInterface) => {
        const { value } = e.target;
        setShowPage(value);
    }

    return (
        <div className="pb-5">
            <div className="my-5 lg:my-8 bg-white/10 rounded-md text-white/80">
                <div className="flex justify-between items-center gap-5 p-5">
                    <h1 className="capitalize font-semibold">
                        {t("transactions.all")}
                    </h1>
                    <div className="flex items-center gap-3">
                        <h1 className="hidden lg:flex">{t("transactions.rowsPerPage")}</h1>
                        <div className="w-20">
                            <InputSelect
                                value={showPage}
                                data={PAGINATION}
                                handleChange={handlePaginationChange}
                            />
                        </div>
                    </div>
                </div>
                <hr className="border-black/30 w-full h-0.5" />
                <div className="mt-3 max-w-full max-h-[60dvh] overflow-scroll">
                    <table className="w-full">
                        <thead className="font-semibold">
                            <tr>
                                {
                                    headers.map((header, index) =>
                                        <td
                                            key={index}
                                            className="text-start px-5 py-3"
                                        >
                                            <div className="flex items-center max-w-30 gap-2">
                                                <h1 className="truncate">
                                                    {header}
                                                </h1>
                                                <Order />
                                            </div>
                                        </td>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody className="text-white/70 text-sm">
                            {
                                transactions.map((transaction, index) => {
                                    const {
                                        id,
                                        amount,
                                        method,
                                        status,
                                        transactionId,
                                        createdAt,
                                        reservation
                                    } = transaction;

                                    const driver = reservation?.driver;
                                    const lot = reservation?.lot;

                                    const dateTimeCreated = new Date(createdAt);
                                    const createdDate = getDateFormat(dateTimeCreated);
                                    const createdTime = getTimeFormat(dateTimeCreated);
                                    const statusLabel = t(`transactions.status.${status}`);

                                    return (
                                        <tr
                                            key={id}
                                            className={index % 2 === 0 ? "bg-black/10" : ""}
                                        >
                                            <td className="px-5 py-4">
                                                <div className="truncate max-w-35">
                                                    {driver?.fullName || "—"}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="truncate max-w-35">
                                                    {lot?.name || "—"}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="font-medium">
                                                    ${Number(amount).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="capitalize">
                                                    {method || "—"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={
                                                        `text-xs font-medium capitalize px-2.5 py-1 rounded-full
                                                        ${statusStyles[status] || "text-white bg-white/10"}`
                                                    }
                                                >
                                                    {statusLabel === `transactions.status.${status}` ? status : statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="truncate block max-w-30 text-xs font-mono text-white/50">
                                                    {transactionId || "—"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-xs text-white/60 whitespace-nowrap">
                                                    <div>{createdDate}</div>
                                                    <div className="mt-0.5">{createdTime}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                showPage={+showPage}
                count={count}
            />
        </div>
    )
}

export default TransactionTable;
