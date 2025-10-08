"use client";

import { ArrowLeft, ArrowRight, Edit2, Trash2 } from "lucide-react";
import Order from "./ui/order";
import { useEffect, useState } from "react";

interface TabelInterface {
    title: string,
    headers: Array<string>,
    body: {
        rows: Array<Record<string, any>>,
        cols: Array<string>
    }
}

const customCheckStyle = `
    appearance-none
    bg-white/10
    w-4 h-4
    rounded-[5px]
    checked:before:content-['✔']
    checked:before:text-white
    checked:before:absolute
    checked:before:bottom-[1px]
    checked:before:right-[1.5px]
    cursor-pointer
`

const Table = ({
    title,
    headers,
    body
}: TabelInterface) => {
    const { rows, cols } = body;
    const [selected, setSelected] = useState(rows.map(({ id }) => ({
        id,
        checked: false
    })))

    const [selectedAll, setSelectedAll] = useState(false);

    const handleSeleted = (selectedId: number) => {
        setSelected(prev => prev.map(({ id, checked }) => id !== selectedId ? {
            id,
            checked
        } : {
            id,
            checked: !checked
        }))
        setSelectedAll(false);
    }

    const handleSelectedAll = (checkedAll: boolean) => {
        setSelectedAll(prev => !prev);
        setSelected(prev => prev.map(({ id }) => ({
            id,
            checked: checkedAll
        })))
    }

    useEffect(() => {
        setSelected(rows.map(({ id }) => ({
            id,
            checked: false
        })))
    }, [rows.length])

    return (
        <>
            <div className="my-5 lg:my-8 bg-black/10 rounded-md text-white/70">
                <div className="flex justify-between items-center gap-5 p-5">
                    <h1>
                        All {title}
                    </h1>
                    <h1>
                        <span className="text-violet-950">1-10</span> of 480
                    </h1>
                </div>
                <hr className="border-black/30 w-full h-0.5" />
                <div className="w-full overflow-scroll">
                    <table className="w-full">
                        <thead className="font-semibold">
                            <tr>
                                <td className="pl-5 w-0.5">
                                    <span className="relative">
                                        <input
                                            type="checkbox"
                                            className={customCheckStyle}
                                            checked={selectedAll}
                                            onChange={e => handleSelectedAll(e.target.checked)}
                                        />
                                    </span>
                                </td>
                                {
                                    headers.map((item, index) =>
                                        <td
                                            key={index}
                                            className="text-start px-5 py-3"
                                        >
                                            <span className="flex items-center gap-2">
                                                {item}
                                                <Order />
                                            </span>
                                        </td>
                                    )
                                }
                                <td className="text-center px-5 py-3">
                                    Actions
                                </td>
                            </tr>
                        </thead>
                        <tbody className="text-white/60 text-sm">
                            {
                                rows.map((item, index) => {
                                    const checked = selected.find(_item => _item.id === item.id)?.checked || false;
                                    return (
                                        <tr
                                            key={item.id}
                                            className={index % 2 === 0 ? "bg-black/5" : ""}
                                        >
                                            <td className="pl-5 w-0.5">
                                                <span className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className={customCheckStyle}
                                                        checked={checked}
                                                        onChange={() => handleSeleted(item.id)}
                                                    />
                                                </span>
                                            </td>
                                            {
                                                cols.map(key =>
                                                    <td
                                                        key={key}
                                                        className="px-5 py-4"
                                                    >
                                                        {item[key]}
                                                    </td>
                                                )
                                            }
                                            <td className="flex justify-center gap-3 px-5 py-4">
                                                <Edit2
                                                    size={18}
                                                    className="text-blue-950 cursor-pointer hover:scale-105"
                                                />
                                                <Trash2
                                                    size={18}
                                                    className="text-red-600 cursor-pointer hover:scale-105"
                                                />
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
        </>
    )
}

export default Table;