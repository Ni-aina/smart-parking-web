"use client";

import { useState } from "react";
import Navbar from "../Navbar";

const ClientType = () => {
    const [search, setSearch] = useState("");

    const handleAddType = ()=> {

    }

    return (
        <>
            <Navbar
                title="Vehicle type"
                search={search}
                setSearch={setSearch}
                onAdd={handleAddType}
            />
        </>
    )
}
 
export default ClientType;