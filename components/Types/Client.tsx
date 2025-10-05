"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import Table from "../Table";

const ClientType = () => {
    const [search, setSearch] = useState("");

    const headers = ["Type", "Description"];
    const body = {
        rows: [
            {
                id: 1,
                type: "Truck",
                description: "1m 80 of larger, 3m 40 of heighter"
            },
            {
                id: 2,
                type: "Mini-bus",
                description: "1m 20 of larger, 2m of heighter"
            },
            {
                id: 3,
                type: "Bus",
                description: "1m 60 of larger, 2m 40 of heighter"
            },
            {
                id: 4,
                type: "4x4",
                description: "1m 40 of larger, 1m 80 of heighter"
            }
        ],
        cols: [
            "type",
            "description"
        ]
    }

    const title = "Vehicle types"

    const handleAddType = () => {

    }

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={handleAddType}
            />
            <Table
                title={title}
                headers={headers}
                body={body}
            />
        </div>
    )
}

export default ClientType;