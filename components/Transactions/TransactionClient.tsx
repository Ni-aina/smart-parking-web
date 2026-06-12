"use client";

import { useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { PaymentInterface } from "@/types/payment";
import TransactionTable from "./TransactionTable";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import NoData from "../ui/noData";
import { useTranslation } from "@/context/LanguageContext";

interface TransactionClientProps {
    transactions: PaymentInterface[];
    count: number;
    searchTerm: string;
}

const TransactionClient = ({
    transactions,
    count,
    searchTerm
}: TransactionClientProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState<string>(searchTerm);
   const [isPending, startTransition] = useTransition();

    const {
        debouncedValue: debouncedSearch
    } = useDebounce(search, 300);

     const handleFilter = ()=> {
        startTransition(() => {
            toast.loading(t("transactions.loadingData"), { id: "filter-loading" });
            router.push(`${pathname}?page=1&searchTerm=${debouncedSearch}`);
        })
    }

    useEffect(() => {
        if (!debouncedSearch) {
            router.push(pathname);
            return;
        } 
        handleFilter();
    }, [
        pathname,
        debouncedSearch
    ])

    useEffect(() => {
        if (isPending) return;
        toast.dismiss("filter-loading");
    }, [isPending])

    return (
        <div className="flex flex-col gap-5">
            <div
                className="flex flex-wrap justify-between items-center text-white gap-5 
                bg-white/10 backdrop-blur-md rounded-lg px-6 py-4"
            >
                <h1 className="text-lg font-semibold tracking-wide">
                    {t("transactions.history")}
                </h1>
                <div
                    className="flex items-center bg-white/10 backdrop-blur-sm border 
                    border-white/5 rounded-lg px-4 py-2 gap-2"
                >
                    <Search size={14} className="text-white/60" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent placeholder:text-white/40"
                        placeholder={t("transactions.searchPlaceholder")}
                    />
                </div>
            </div>
            {
                !count ?
                    <NoData
                        message={t("transactions.noData")}
                    />
                :
                    <TransactionTable
                        transactions={transactions}
                        count={count}
                    />
            }
        </div>
    )
}

export default TransactionClient;
