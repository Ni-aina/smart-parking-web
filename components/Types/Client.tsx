"use client";

import { FormEvent, useState } from "react";
import Navbar from "../Navbar";
import Table from "../Table";
import { Modal } from "../ui/modal";

const ClientType = () => {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={() => setIsModalOpen(true)}
            />
            <Table
                title={title}
                headers={headers}
                body={body}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add vehicle type"
            >
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-3">
                        <label htmlFor="type">Type</label>
                        <input
                            type="text"
                            name="type"
                            required
                            className="outline-none px-4 py-2 border border-white/70 rounded-sm"
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            required
                            className="outline-none px-4 py-2 border border-white/70 rounded-sm"
                        />
                    </div>
                    <div className="mt-3 w-full flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="w-[120px] h-[40px] flex justify-center items-center 
                            bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        >
                            Cancel
                        </button>
                        <button
                            className="w-[120px] h-[40px] flex justify-center items-center 
                            bg-blue-950/20 rounded-sm cursor-pointer hover:opacity-80"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ClientType;