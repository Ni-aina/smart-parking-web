"use client";

import { ReactNode, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

const SubmitForm = ({ children, pendingMessage }: { children: ReactNode, pendingMessage: string }) => {
    const { pending } = useFormStatus();

    useEffect(() => {
        if (pending) {
            toast.loading(pendingMessage, {
                id: `toast-${pendingMessage}`,
            });
        } else {
            toast.dismiss(`toast-${pendingMessage}`);
        }
    }, [pending]);

    return children;
}

export default SubmitForm;