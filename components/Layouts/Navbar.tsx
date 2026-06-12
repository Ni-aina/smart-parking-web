"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { 
    ChangeEvent, 
    Dispatch, 
    SetStateAction, 
    useEffect,
    useTransition
} from "react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";

interface Navbarinterface {
    title: string;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    onAdd: ()=> void;
    listTitle?: string;
    searchPlaceholder?: string;
    addLabel?: string;
    loadingLabel?: string;
}

const Navbar = ({
    title,
    search,
    setSearch,
    onAdd,
    listTitle,
    searchPlaceholder,
    addLabel,
    loadingLabel
}: Navbarinterface) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isPending, startTransition] = useTransition();
    const {
        debouncedValue: debouncedSearch
    } = useDebounce(search, 300);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearch(value);
    }

    const handleFilter = ()=> {
        startTransition(() => {
            toast.loading(loadingLabel || "Loading data...", { id: "filter-loading" });
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
        <div className="flex flex-wrap justify-between items-center text-white/90 gap-5">
            <div className="flex flex-wrap items-center gap-5">
                <h1 className="font-semibold">{listTitle || `${title} list`}</h1>
                <div className="flex items-center border border-white/30 rounded-sm px-4 py-2 gap-2">
                    <Search size={14} />
                    <input 
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full text-sm outline-none"
                        placeholder={searchPlaceholder || `Search for ${title.toLowerCase()}...`}
                    />
                </div>
            </div>
            <div className="flex flex-end">
                <button
                    className="px-5 py-2 rounded-sm bg-white text-black cursor-pointer hover:opacity-80"
                    onClick={onAdd}
                >
                    {addLabel || `Add new ${title.toLowerCase()}`}
                </button>
            </div>
        </div>
    )
}
 
export default Navbar;
