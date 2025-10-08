"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "../Navbar";
import Table from "../Table";
import { Modal } from "../ui/modal";
import { FormTypeInterface, TypeInterface } from "@/types/type";
import { createType } from "@/actions/type.action";
import { Loader2 } from "lucide-react";

const initForm = {
    type: "",
    description: ""
}

const ClientType = ({ types }: { types: TypeInterface[] }) => {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState<FormTypeInterface>(initForm);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const title = "Vehicle types";
    const headers = ["Type", "Description"];

    const body = {
        rows: types.map(item => ({
            id: item.id,
            type: item.type,
            description: item.description
        })),
        cols: [
            "type",
            "description"
        ]
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        const newType = await createType(formData);
        setIsPending(false);
        if (!newType) return;
        setFormData(initForm);
        setIsModalOpen(false);
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
                            onChange={handleChange}
                            required
                            className="outline-none px-4 py-2 border border-white/70 rounded-sm"
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            onChange={handleChange}
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
                            className="w-[120px] h-[40px] flex justify-center items-center gap-2
                            bg-blue-950/20 rounded-sm cursor-pointer hover:opacity-80
                            disabled:cursor-not-allowed disabled:opacity-80"
                            disabled={isPending}
                        >
                            {
                                isPending &&
                                <Loader2
                                    size={14}
                                    className="animate-spin"
                                />
                            }
                            <span>Add</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ClientType;