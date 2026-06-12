"use client";

import Navbar from "../Layouts/Navbar";
import Table from "../Table";
import { Modal } from "../ui/modal";
import { TypeInterface } from "@/types/type";
import { Loader2 } from "lucide-react";
import useType from "@/hooks/useType";
import InputNumber from "../ui/inputNumber";
import NoData from "../ui/noData";
import { useTranslation } from "@/context/LanguageContext";

const ClientType = ({ 
    types,
    count,
    searchTerm
 }: { 
    types: TypeInterface[],
    count: number,
    searchTerm: string
 }) => {
    const { t } = useTranslation();

    const {
        formData,
        search,
        setSearch,
        isModalOpen,
        setIsModalOpen,
        isPending,
        title,
        headers,
        tableLabels,
        body,
        handleChange,
        handleSubmit,
        handleOnClose,
        handleEdit,
        handleDelete
    } = useType({ 
        types,
        searchTerm
    })

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
                listTitle={t("types.listTitle")}
                searchPlaceholder={t("types.searchPlaceholder")}
                addLabel={t("types.addNew")}
                loadingLabel={t("types.loadingData")}
            />
            {
                !count ?
                    <NoData
                        message={t("types.noData")}
                        description=""
                    />
                :
                    <Table
                        title={title}
                        headers={headers}
                        body={body}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        count={count}
                        labels={tableLabels}
                    />
            }
            <Modal
                isOpen={isModalOpen}
                onClose={handleOnClose}
                title={id ? t("types.form.updateTitle") : t("types.form.addTitle")}
            >
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-3">
                        <label htmlFor="type">{t("types.form.vehicleType")}</label>
                        <input
                            type="text"
                            name="vehicleType"
                            value={vehicleType}
                            onChange={handleChange}
                            required
                            className="outline-none px-4 py-2 border border-white/10 rounded-sm" />
                        <label htmlFor="type">{t("types.form.maxWidth")}</label>
                        <InputNumber
                            name="maxWidth"
                            value={`${maxWidth}`}
                            handleChange={handleChange}
                            min={0}
                        />
                        <label htmlFor="type">{t("types.form.maxLength")}</label>
                        <InputNumber
                            name="maxLength"
                            value={`${maxLength}`}
                            handleChange={handleChange}
                            min={0}
                        />
                        <label htmlFor="type">{t("types.form.maxHeight")}</label>
                        <InputNumber
                            name="maxHeight"
                            value={`${maxHeight}`}
                            handleChange={handleChange}
                            min={0}
                        />
                        <label htmlFor="description">{t("types.form.description")}</label>
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
                            className="w-30 h-10 flex justify-center items-center 
                            bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        >
                            {t("types.form.cancel")}
                        </button>
                        <button
                            className="w-30 h-10 flex justify-center items-center gap-2
                            bg-white text-black rounded-sm cursor-pointer hover:opacity-80
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
                            <span>
                                {id ? t("types.form.update") : t("types.form.add")}
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ClientType;
