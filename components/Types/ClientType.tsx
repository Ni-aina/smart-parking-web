"use client";

import Navbar from "../Layouts/Navbar";
import Table from "../Table";
import { TypeInterface } from "@/types/type";
import useType from "@/hooks/useType";
import NoData from "../ui/noData";
import { useTranslation } from "@/context/LanguageContext";
import FormType from "./FormType";

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
            <FormType
                isModalOpen={isModalOpen}
                handleOnClose={handleOnClose}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                id={id}
                vehicleType={vehicleType}
                maxWidth={maxWidth}
                maxLength={maxLength}
                maxHeight={maxHeight}
                description={description}
                isPending={isPending}
            />
        </div>
    )
}

export default ClientType;
