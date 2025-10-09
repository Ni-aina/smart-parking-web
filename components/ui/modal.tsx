import { XCircle } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-black/80 rounded-lg shadow-lg w-full max-w-md p-6 relative text-white/80"
        onClick={(e) => e.stopPropagation()}
      >
        {
          title &&
          <h2 className="text-md font-semibold text-white uppercase mb-5">
            {title}
          </h2>
        }
        {children}
        <button
          className="absolute top-5 right-5 hover:opacity-80 cursor-pointer"
          onClick={onClose}
        >
          <XCircle
            size={24}
          />
        </button>
      </div>
    </div>
  )
}