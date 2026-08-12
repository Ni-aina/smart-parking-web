"use client";

import { useTranslation } from "@/context/LanguageContext";
import { Modal } from "../ui/modal";
import InputNumber from "../ui/inputNumber";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";

interface FormTypeInterface {
    isModalOpen: boolean;
    handleOnClose: () => void;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    id?: string;
    vehicleType: string;
    maxWidth: string;
    maxLength: string;
    maxHeight: string;
    description: string;
    isPending: boolean;
}

const FormType = ({
    isModalOpen,
    handleOnClose,
    handleSubmit,
    id,
    vehicleType,
    maxWidth,
    maxLength,
    maxHeight,
    description,
    handleChange,
    isPending
}: FormTypeInterface) => {
    const { t } = useTranslation();

    return (
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
    )
}

export default FormType;