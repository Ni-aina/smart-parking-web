"use client";

import { createType, deleteType, updateType } from "@/actions/type.action";
import { useTranslation } from "@/context/LanguageContext";
import { FormTypeInterface, TypeInterface } from "@/types/type";
import { ChangeEvent, FormEvent, startTransition, useOptimistic, useState } from "react";

interface OptimisticTypeInterface {
    type: "update" | "delete",
    vehicleType: FormTypeInterface
}

const initForm = {
    vehicleType: "",
    description: "",
    maxWidth: "",
    maxLength: "",
    maxHeight: ""
}

const useType = ({ types, searchTerm }: { types: TypeInterface[], searchTerm: string }) => {
    const { t } = useTranslation();

    const [optimisticTypes, addOptimisticTypes] = useOptimistic(
        types,
        (currentType: TypeInterface[], actions: OptimisticTypeInterface) => {
            const { type, vehicleType } = actions;
            switch (type) {
                case "update": {
                    const updatedType = currentType.map(item => item.id !== vehicleType.id ?
                        item : {
                            ...item,
                            type: vehicleType.vehicleType,
                            description: vehicleType.description
                        }
                    )
                    return updatedType;
                }
                case "delete": {
                    return currentType.filter(item => item.id !== vehicleType.id);
                }
                default: return currentType;
            }
        }
    )

    const [search, setSearch] = useState(searchTerm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState<FormTypeInterface>(initForm);

    const title = t("types.title");
    const headers = [
        t("types.headers.vehicle"),
        t("types.headers.maxWidth"),
        t("types.headers.maxLength"),
        t("types.headers.maxHeight"),
        t("types.headers.description")
    ]
    const tableLabels = {
        all: t("types.table.all"),
        delete: t("types.table.delete"),
        rowsPerPage: t("types.table.rowsPerPage"),
        actions: t("types.table.actions"),
        confirmTitle: t("types.confirm.title"),
        confirmMessage: t("types.confirm.message"),
        confirmCancel: t("types.confirm.cancel"),
        confirmConfirm: t("types.confirm.confirm")
    }

    const body = {
        rows: optimisticTypes.map(item => ({
            id: item.id,
            type: item.vehicleType,
            width: `${item.maxWidth} m`,
            length: `${item.maxLength} m`,
            height: `${item.maxHeight} m`,
            description: item.description
        })),
        cols: [
            "type",
            "width",
            "length",
            "height",
            "description"
        ]
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnClose = () => {
        setFormData(initForm);
        setIsModalOpen(false);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { id } = formData;

        if (!id) {
            setIsPending(true);
            const newType = await createType(formData);
            setIsPending(false);
            if (!newType) return;
            setFormData(initForm);
            setIsModalOpen(false);
            return;
        }

        handleOnClose();
        startTransition(() => {
            addOptimisticTypes({
                type: "update",
                vehicleType: formData
            });
            updateType(formData);
        })
    }

    const handleEdit = (id: string) => {
        const type = types.filter(item => item.id === id)
            .map(({
                id,
                vehicleType,
                maxWidth,
                maxLength,
                maxHeight,
                description,
            }) => ({
                id,
                vehicleType,
                maxWidth,
                maxLength,
                maxHeight,
                description: description || ""
            }))?.at(0);

        if (!type) return;
        setFormData(type);
        setIsModalOpen(true);
    }

    const handleDelete = (id: string) => {
        startTransition(() => {
            addOptimisticTypes({
                type: "delete",
                vehicleType: {
                    id,
                    ...formData
                }
            });
            deleteType(id);
        })
    }

    return {
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
    }
}

export default useType;
