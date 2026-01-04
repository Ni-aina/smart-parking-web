"use client";

import Navbar from "../Navbar";
import Table from "../Table";
import { Modal } from "../ui/modal";
import { TypeInterface } from "@/types/type";
import { Loader2 } from "lucide-react";
import useType from "@/hooks/useType";
import InputNumber from "../ui/inputNumber";

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
        vehicleType,
        maxWidth,
        maxLength,
        maxHeight,
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
                title={`${id ? "Update" : "Add"} lot type`}
            >
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-3">
                        <label htmlFor="type">Vehicle type *</label>
                        <input
                            type="text"
                            name="vehicleType"
                            value={vehicleType}
                            onChange={handleChange}
                            required
                            className="outline-none px-4 py-2 border border-white/10 rounded-sm" />
                        <label htmlFor="type">Max width (m) *</label>
                        <InputNumber
                            name="maxWidth"
                            value={`${maxWidth}`}
                            handleChange={handleChange}
                            min={0}
                        />
                        <label htmlFor="type">Max length (m) *</label>
                        <InputNumber
                            name="maxLength"
                            value={`${maxLength}`}
                            handleChange={handleChange}
                            min={0}
                        />
                        <label htmlFor="type">Max height (m) *</label>
                        <InputNumber
                            name="maxHeight"
                            value={`${maxHeight}`}
                            handleChange={handleChange}
                            min={0}
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={handleChange}
                            className="outline-none px-4 py-2 border border-white/10 rounded-sm"
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
                            <span>{id ? "Update" : "Add"}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ClientType;
