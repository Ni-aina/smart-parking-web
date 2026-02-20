import useDebounce from "@/hooks/useDebounce";
import { SelectInterface } from "@/types/input";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface InpuSelectInterface {
    name?: string;
    value: string;
    data: Array<{
        id: string;
        value: string;
    }>;
    handleChange: (e: SelectInterface) => void;
    placeholder?: string;
    searchParamName?: string;
}

const InputSelect = ({
    name,
    value,
    data,
    handleChange,
    placeholder,
    searchParamName
}: InpuSelectInterface) => {
    const router = useRouter();
    const pathname = usePathname();

    const [searchQuery, setSearchQuery] = useState("");

    const [openMenu, setOpenMenu] = useState(false);
    const handleOpenMenu = () => setOpenMenu(prev => !prev);
    const selected = data.find((item) => item.id === value);

    const {
        debouncedValue: debouncedSearchQuery
    } = useDebounce(searchQuery, 300);

    useEffect(()=> {
        if (!debouncedSearchQuery) {
            router.push(pathname);
            return;
        }
        router.push(`?${searchParamName}=${debouncedSearchQuery}`);
    }, [
        searchParamName,
        debouncedSearchQuery
    ])
    
    return (
        <div className="relative w-full pl-4 pr-2 py-2 border border-white/10 rounded-sm">
            <button
                className="flex w-full justify-between items-center gap-2 cursor-pointer"
                onClick={handleOpenMenu}
                type="button"
            >
                <span className="truncate">
                    {
                        selected ? selected.value :
                            <span className="text-gray-400">
                                {placeholder}
                            </span>
                    }
                </span>
                <ChevronDown
                    size={20}
                    className={`
                        transition-transform 
                        ${openMenu ? "rotate-180" : "rotate-0"} 
                        text-red-500`
                    }
                />
            </button>
            {
                openMenu &&
                <div className="absolute left-0 top-full mt-1 z-10 flex flex-col gap-2 px-2 py-2 w-full 
                bg-neutral-950 border border-white/10 rounded-md shadow-lg max-h-64 overflow-y-auto"
                >
                    {
                        searchParamName &&
                        <input 
                            type="text" 
                            className="w-full px-2 py-1 border border-white/10 
                            outline-none rounded-sm bg-neutral-950"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    }
                    {
                        data.length === 0 ?
                        <div className="text-center text-white/70 p-2">
                            No data found
                        </div>
                        :
                        data.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() => {
                                    handleChange({
                                        target: {
                                            name,
                                            value: item.id
                                        }
                                    });
                                    setOpenMenu(false);
                                }}
                                className={`
                                        flex items-center w-full gap-2 px-2 py-2 cursor-pointer 
                                        text-start text-sm
                                        hover:bg-white/5 text-white/80 rounded-sm
                                        ${item.id === value && "bg-white/5"}
                                    `}
                            >
                                {item.value}
                            </button>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default InputSelect;