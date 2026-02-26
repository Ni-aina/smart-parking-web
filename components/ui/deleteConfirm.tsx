"use client";

import { Modal } from "./modal";

interface DeleteConfrimProps {
    isOpen: boolean;
    handleCancel: ()=> void;
    handleConfirm: ()=> void;
}

const DeleteConfrim = ({
    isOpen,
    handleCancel,
    handleConfirm
}: DeleteConfrimProps) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="This action is irreversible!"
        >
            <div className="flex flex-col gap-3">
                <p className="text-sm text-red-600">Are you sure to proccess it?</p>
                <div className="mt-3 w-full flex justify-end gap-3">
                    <button
                        className="w-30 h-10 flex justify-center items-center 
                                bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-30 h-10 flex justify-center items-center gap-2
                                bg-white text-black rounded-sm cursor-pointer hover:opacity-80
                                disabled:cursor-not-allowed disabled:opacity-80"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteConfrim;