"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

const SubmitForm = ({ children, pendingMessage }: { children: ReactNode, pendingMessage: string }) => {
    const { pending } = useFormStatus();
    const toastId = useRef<string | number | null>(null);

    useEffect(() => {
        if (pending) {
            toastId.current = toast.loading(pendingMessage);
        } else {
            if (toastId.current) {
                toast.dismiss(toastId.current);
                toastId.current = null;
            }
        }
    }, [pending]);

    return children;
}

export default SubmitForm;