"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import { useRouter } from "next/navigation";

const ClientParkingLots = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title="Parking lots"
                search={search}
                setSearch={setSearch}
                onAdd={()=> router.push("/owner/parking-lots/form/new")}
            />
        </div>
    )
}

export default ClientParkingLots;