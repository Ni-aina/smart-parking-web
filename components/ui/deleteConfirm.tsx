"use client";

import { Modal } from "./modal";

interface DeleteConfirmProps {
    isOpen: boolean;
    handleCancel: ()=> void;
    handleConfirm: ()=> void;
    title?: string;
    message?: string;
    cancelLabel?: string;
    confirmLabel?: string;
}

const DeleteConfirm = ({
    isOpen,
    handleCancel,
    handleConfirm,
    title = "This action is irreversible!",
    message = "Are you sure to proccess it?",
    cancelLabel = "Cancel",
    confirmLabel = "Confirm"
}: DeleteConfirmProps) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={title}
        >
            <div className="flex flex-col gap-3">
                <p className="text-sm text-red-600">{message}</p>
                <div className="mt-3 w-full flex justify-end gap-3">
                    <button
                        type="button"
                        className="w-30 h-10 flex justify-center items-center 
                                bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        onClick={handleCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="w-30 h-10 flex justify-center items-center gap-2
                                bg-white text-black rounded-sm cursor-pointer hover:opacity-80
                                disabled:cursor-not-allowed disabled:opacity-80"
                        onClick={handleConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteConfirm;
