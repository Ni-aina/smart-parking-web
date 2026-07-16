import { Loader2 } from "lucide-react";

const ConversationLoading = () => {
    return (
        <section
            className="flex min-h-0 flex-1 items-center justify-center rounded-md 
            bg-white/10 p-6 text-center shadow-sm shadow-black/20"
        >
            <Loader2 className="animate-spin size-8 text-white/60" />
        </section>
    )
}

export default ConversationLoading;