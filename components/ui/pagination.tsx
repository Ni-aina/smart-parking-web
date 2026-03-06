"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface PaginationProps {
    showPage: number;
    count: number;
}

const Pagination = ({
    showPage,
    count
}: PaginationProps) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const pathname = usePathname();
    const router = useRouter();

    const [activePage, setActivePage] = useState(page ? parseInt(page) : 1);
    const [isPending, startTransition] = useTransition();

    const start = (activePage - 1) * showPage + 1;
    const to = Math.min(count, start + showPage - 1);
    const total = Math.max(to, count);

    const maxPage = Math.ceil(total / showPage);

    const navigateToPage = (page: number) => {
        startTransition(() => {
            toast.loading("Loading data...", { id: "pagination-loading" });
            router.push(`?page=${page}&limit=${showPage}`);
            setActivePage(page);
        })
    }

    const handleDecreasePage = () => {
        const updatedPage = Math.max(0, activePage - 1);
        navigateToPage(updatedPage);
    }

    const handleIncreasePage = () => {
        const updatedPage = Math.min(maxPage, activePage + 1);
        navigateToPage(updatedPage);
    }

    useEffect(()=> {
        if (!page) return;
        setActivePage(parseInt(page));
    }, [page])

    useEffect(() => {
        router.push(pathname);
        setActivePage(1);
    }, [showPage])

    useEffect(() => {
        if (isPending) return;
        toast.dismiss("pagination-loading");
    }, [isPending])

    if (!count) return null;

    return (
        <div className="flex flex-wrap justify-between items-center gap-3 text-white/60">
            <h1 className="text-sm">
                {start}-{to} of {total}
            </h1>
            <div className="flex items-center gap-3">
                <button
                    className="p-2 bg-white/5 rounded-sm cursor-pointer  
                    hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleDecreasePage}
                    disabled={activePage < 2 || isPending}
                >
                    <ArrowLeft
                        size={18}
                    />
                </button>
                <h1>
                    {activePage}
                </h1>
                <button
                    className="p-2 bg-white/5 rounded-sm cursor-pointer 
                    hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleIncreasePage}
                    disabled={activePage >= maxPage || isPending}
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