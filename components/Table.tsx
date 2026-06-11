"use client";

import { Edit, Trash2 } from "lucide-react";
import Order from "./ui/order";
import { useEffect, useState } from "react";
import { Modal } from "./ui/modal";
import { customCheckStyle } from "@/lib/customChexBoxStyle";
import Image from "next/image";
import InputSelect from "./ui/inputSelect";
import { SelectInterface } from "@/types/input";
import Pagination from "./ui/pagination";
import { PAGINATION } from "@/lib/pagination";
import DeleteConfirm from "./ui/deleteConfirm";

interface TabelInterface {
    title: string;
    headers: Array<string>;
    body: {
        rows: Array<Record<string, string>>;
        cols: Array<string>;
    };
    count: number;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => void;
}

const Table = ({
    title,
    headers,
    body,
    handleEdit,
    handleDelete,
    count
}: TabelInterface) => {

    const [showPage, setShowPage] = useState("10");

    const handlePaginationChange = (e: SelectInterface) => {
        const { value } = e.target;
        setShowPage(value);
    }

    const { rows, cols } = body;
    const [selected, setSelected] = useState(rows.map(({ id }) => ({
        id,
        checked: false
    })))

    const [selectedAll, setSelectedAll] = useState(false);
    const [isConfirmId, setIsConfirmId] = useState("");
    const [allConfirmIds, setAllConfirmIds] = useState<Array<string>>([]);

    const isSelected = selected.some(item => item.checked);

    const handleSeleted = (selectedId: string) => {
        setSelected(prev => prev.map(({ id, checked }) => id !== selectedId ? {
            id,
            checked
        } : {
            id,
            checked: !checked
        }))
        if (selected.reduce((acc, curr) =>
            curr.id !== selectedId ?
                curr.checked ?
                    acc + 1
                    : acc :
                curr.checked ?
                    acc :
                    acc + 1,
            0) === rows.length) {
            setSelectedAll(true);
            return;
        }
        setSelectedAll(false);
    }

    const handleSelectedAll = (checkedAll: boolean) => {
        setSelectedAll(prev => !prev);
        setSelected(prev => prev.map(({ id }) => ({
            id,
            checked: checkedAll
        })))
    }

    const handleSetAllConfirmIds = () => {
        setAllConfirmIds(() => selected.filter(item => item.checked).map(item => item.id));
    }

    const handleConfirm = () => {
        if (isConfirmId) {
            handleDelete(isConfirmId);
            setIsConfirmId("");
        }
        if (allConfirmIds.length) {
            Promise.all(allConfirmIds.map(id => handleDelete(id)));
            setAllConfirmIds([]);
        }
    }

    useEffect(() => {
        setSelected(rows.map(({ id }) => ({
            id,
            checked: false
        })))
    }, [rows.length])

    return (
        <>
            <div className="my-5 lg:my-8 bg-white/10 rounded-md text-white/80">
                <div className="flex justify-between items-center gap-5 p-5">
                    <div className="flex items-center gap-3">
                        <h1 className="capitalize font-semibold">
                            All {title}
                        </h1>
                        {
                            isSelected &&
                            <button
                                className="bg-white/10 text-red-500 text-xs rounded px-3 py-1.5
                                cursor-pointer hover:text-white/70 disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleSetAllConfirmIds}
                            >
                                Delete
                            </button>
                        }
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="hidden lg:flex">Rows per pages</h1>
                        <div className="w-20">
                            <InputSelect
                                value={showPage}
                                data={PAGINATION}
                                handleChange={handlePaginationChange}
                            />
                        </div>
                    </div>
                </div>
                <hr className="border-black/30 w-full h-0.5" />
                <div className="mt-3 max-w-full max-h-[60dvh] overflow-scroll">
                    <table className="w-full">
                        <thead className="font-semibold">
                            <tr>
                                <td className="pl-5 w-0.5">
                                    <div className="flex h-full items-center">
                                        <input
                                            type="checkbox"
                                            className={customCheckStyle}
                                            checked={selectedAll}
                                            onChange={e => handleSelectedAll(e.target.checked)}
                                        />
                                    </div>
                                </td>
                                {
                                    headers.map((item, index) =>
                                        <td
                                            key={index}
                                            className="text-start px-5 py-3"
                                        >
                                            <div className="flex items-center max-w-30 gap-2">
                                                <h1 className="truncate">
                                                    {item}
                                                </h1>
                                                <Order />
                                            </div>
                                        </td>
                                    )
                                }
                                <td className="text-end pr-5 py-3 lg:pr-8">
                                    Actions
                                </td>
                            </tr>
                        </thead>
                        <tbody className="text-white/70 text-sm">
                            {
                                rows.map((item, index) => {
                                    const checked = selected.find(_item => _item.id === item.id)?.checked || false;
                                    return (
                                        <tr
                                            key={item.id}
                                            className={index % 2 === 0 ? "bg-black/10" : ""}
                                        >
                                            <td className="pl-5 w-0.5">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className={customCheckStyle}
                                                        checked={checked}
                                                        onChange={() => handleSeleted(item.id)}
                                                    />
                                                </div>
                                            </td>
                                            {
                                                cols.map(key =>
                                                    <td
                                                        key={key}
                                                        className="px-5 py-4"
                                                    >
                                                        {
                                                            key.includes("urlImage") ?
                                                                <div className="relative w-10 h-10">
                                                                    <Image
                                                                        src={item.urlImage}
                                                                        alt={item.urlImage}
                                                                        fill
                                                                        className="object-cover rounded-full"
                                                                    />
                                                                </div>
                                                                :
                                                                <h1>
                                                                    {
                                                                        item[key]
                                                                    }
                                                                </h1>
                                                        }
                                                    </td>
                                                )
                                            }
                                            <td className="pr-8 py-3 lg:pr-10">
                                                <div className="flex h-full items-center justify-end gap-3">
                                                    <Edit
                                                        className="text-green-600 cursor-pointer hover:scale-105"
                                                        onClick={() => handleEdit(item.id)}
                                                        size={18}
                                                    />
                                                    <Trash2
                                                        size={18}
                                                        onClick={() => setIsConfirmId(item.id)}
                                                        className="text-red-600 cursor-pointer hover:scale-105"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                showPage={+showPage}
                count={count}
            />
            <DeleteConfirm
                isOpen={!!isConfirmId || !!allConfirmIds.length}
                handleCancel={() => {
                    setAllConfirmIds([]);
                    setIsConfirmId("")
                }}
                handleConfirm={handleConfirm}
            />
        </>
    )
}

export default Table;