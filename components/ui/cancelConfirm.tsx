"use client";

import { Modal } from "./modal";

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

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Cancel Reservation"
        >
            <div className="flex flex-col gap-3">
                <p className="text-sm text-white/70">
                    Are you sure you want to cancel this reservation?
                    Only pending or active reservations can be cancelled.
                </p>
                <div className="mt-3 w-full flex justify-end gap-3">
                    <button
                        className="w-[120px] h-[40px] flex justify-center items-center 
                                bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        onClick={handleCancel}
                        type="button"
                    >
                        Go back
                    </button>
                    <button
                        className="w-[120px] h-[40px] flex justify-center items-center gap-2
                                bg-red-500/80 text-white rounded-sm cursor-pointer hover:opacity-80
                                disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        type="button"
                    >
                        {isLoading ? "Cancelling..." : "Confirm"}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default CancelConfirm;
