"use client";

import Navbar from "../Navbar";
import Table from "../Table";
import { Modal } from "../ui/modal";
import { TypeInterface } from "@/types/type";
import { Loader2 } from "lucide-react";
import useType from "@/hooks/useType";

const ClientType = ({ types }: { types: TypeInterface[] }) => {

    const {
        formData,
        search,
        setSearch,
        isModalOpen,
        setIsModalOpen,
        isPending,
        title,
        headers,
        body,
        handleChange,
        handleSubmit,
        handleOnClose,
        handleEdit,
        handleDelete
    } = useType({ types });

    const {
        id, 
        type,
        description
    } = formData;

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
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={handleOnClose}
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
                            value={type}
                            onChange={handleChange}
                            required
                            className="outline-none px-4 py-2 border border-white/70 rounded-sm"
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={handleChange}
                            required
                            className="outline-none px-4 py-2 border border-white/70 rounded-sm"
                        />
                    </div>
                    <div className="mt-3 w-full flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleOnClose}
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
                            <span>{id  ? "Update" : "Add"}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ClientType;