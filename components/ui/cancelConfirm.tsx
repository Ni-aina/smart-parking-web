"use client";

import { Modal } from "./modal";
import { useTranslation } from "@/context/LanguageContext";

interface CancelConfirmProps {
    isOpen: boolean;
    isLoading?: boolean;
    handleCancel: () => void;
    handleConfirm: () => void;
}

const CancelConfirm = ({
    isOpen,
    isLoading,
    handleCancel,
    handleConfirm
}: CancelConfirmProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={t("reservations.confirm.title")}
        >
            <div className="flex flex-col gap-3">
                <p className="text-sm text-white/70">
                    {t("reservations.confirm.message")}
                </p>
                <div className="mt-3 w-full flex justify-end gap-3">
                    <button
                        className="w-30 h-10 flex justify-center items-center 
                                bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        onClick={handleCancel}
                        type="button"
                    >
                        {t("reservations.confirm.goBack")}
                    </button>
                    <button
                        className="w-30 h-10 flex justify-center items-center gap-2
                                bg-red-500/80 text-white rounded-sm cursor-pointer hover:opacity-80
                                disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        type="button"
                    >
                        {isLoading ? t("reservations.confirm.cancelling") : t("reservations.confirm.confirm")}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default CancelConfirm;
