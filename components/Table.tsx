"use client";

import { ArrowLeft, ArrowRight, Edit2, Trash2 } from "lucide-react";
import Order from "./ui/order";
import { useEffect, useState } from "react";
import { Modal } from "./ui/modal";
import { customCheckStyle } from "@/lib/customChexBoxStyle";
import Image from "next/image";

interface TabelInterface {
    title: string;
    headers: Array<string>;
    body: {
        rows: Array<Record<string, string>>;
        cols: Array<string>
    };
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => void;
}



const Table = ({
    title,
    headers,
    body,
    handleEdit,
    handleDelete
}: TabelInterface) => {

    const { rows, cols } = body;
    const [selected, setSelected] = useState(rows.map(({ id }) => ({
        id,
        checked: false
    })))

    const [selectedAll, setSelectedAll] = useState(false);
    const [isConfirmId, setIsConfirmId] = useState("");

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

    const handleConfirm = () => {
        handleDelete(isConfirmId);
        setIsConfirmId("");
    }

    useEffect(() => {
        setSelected(rows.map(({ id }) => ({
            id,
            checked: false
        })))
    }, [rows.length])

    return (
        <>
            <div className="my-5 lg:my-8 bg-black/10 rounded-md text-white/80">
                <div className="flex justify-between items-center gap-5 p-5">
                    <h1>
                        All {title}
                    </h1>
                    <h1>
                        <span className="text-violet-950">1-10</span> of 480
                    </h1>
                </div>
                <hr className="border-black/30 w-full h-0.5" />
                <div className="max-w-full overflow-scroll">
                    <table className="w-full">
                        <thead className="font-semibold">
                            <tr>
                                <td className="pl-5 w-0.5">
                                    <div className="flex h-full items-center">
                                        <span className="relative mt-1.5">
                                            <input
                                                type="checkbox"
                                                className={customCheckStyle}
                                                checked={selectedAll}
                                                onChange={e => handleSelectedAll(e.target.checked)}
                                            />
                                        </span>
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
                                            className={index % 2 === 0 ? "bg-black/5" : ""}
                                        >
                                            <td className="pl-5 w-0.5">
                                                <div className="flex items-center">
                                                    <span className="relative mt-1.5">
                                                        <input
                                                            type="checkbox"
                                                            className={customCheckStyle}
                                                            checked={checked}
                                                            onChange={() => handleSeleted(item.id)}
                                                        />
                                                    </span>
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
                                                    <Edit2
                                                        size={18}
                                                        onClick={() => handleEdit(item.id)}
                                                        className="text-blue-950 cursor-pointer hover:scale-105"
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
            <div className="flex flex-wrap justify-between items-center gap-3 text-white/60">
                <h1 className="text-sm">
                    1-10 of 480
                </h1>
                <div className="flex items-center gap-3">
                    <h1 className="text-sm">Rows per pages</h1>
                    <select name="page" className="text-sm cursor-pointer">
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 bg-blue-950/10 rounded-sm cursor-pointer  
                            hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            <ArrowLeft
                                size={18}
                                className="text-white/80"
                            />
                        </button>
                        <button
                            className="p-2 bg-blue-950/10 rounded-sm cursor-pointer 
                            hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowRight
                                size={18}
                                className="text-white/80"
                            />
                        </button>
                    </div>
                </div>
            </div>
            {
                isConfirmId &&
                <Modal
                    isOpen={!!isConfirmId}
                    onClose={() => setIsConfirmId("")}
                    title="This action is irreversible!"
                >
                    <div className="flex flex-col gap-3">
                        <p className="text-red-600 text-sm">Are you sure to proccess it?</p>
                        <div className="mt-3 w-full flex justify-end gap-3">
                            <button
                                className="w-[120px] h-[40px] flex justify-center items-center 
                                bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                                onClick={() => setIsConfirmId("")}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-[120px] h-[40px] flex justify-center items-center gap-2
                                bg-blue-950/20 rounded-sm cursor-pointer hover:opacity-80
                                disabled:cursor-not-allowed disabled:opacity-80"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            }
        </>
    )
}

export default Table;