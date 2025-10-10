"use client";

import { Search } from "lucide-react";
import { 
    ChangeEvent, 
    Dispatch, 
    SetStateAction 
} from "react";

interface Navbarinterface {
    title: string;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    onAdd: ()=> void;
}

const Navbar = ({
    title,
    search,
    setSearch,
    onAdd
}: Navbarinterface) => {

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearch(value);
    }

    return (  
        <div className="flex flex-wrap justify-between items-center text-white/90 gap-5">
            <div className="flex flex-wrap items-center gap-5">
                <h1 className="font-semibold">{title} list</h1>
                <div className="flex items-center border border-white/30 rounded-sm px-4 py-2 gap-2">
                    <Search size={14} />
                    <input 
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full text-sm outline-none"
                        placeholder={`Search for ${title.toLowerCase()}...`}
                    />
                </div>
            </div>
            <div className="flex flex-end">
                <button
                    className="px-5 py-2 rounded-sm bg-blue-950/20 cursor-pointer hover:opacity-80"
                    onClick={onAdd}
                >
                    Add new {title.toLowerCase()}
                </button>
            </div>
        </div>
    )
}
 
export default Navbar;