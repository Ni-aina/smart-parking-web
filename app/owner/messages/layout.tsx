import { getConversationsByUser } from "@/actions/message.action";
import MessageClient from "@/components/Messages/MessageClient";
import LoadingSkeleton from "@/components/ui/loadingSkeleton";
import { Suspense, ReactNode } from "react";

const ConversationsLoader = async ({
    children
}: {
    children: ReactNode
}) => {
    const conversations = await getConversationsByUser();

    return (
        <MessageClient
            conversations={conversations}
            children={children}
        />
    )
}

const MessageLayout = ({
    children
}: {
    children: ReactNode
}) => (
    <Suspense fallback={<LoadingSkeleton />}>
        <ConversationsLoader>
            {children}
        </ConversationsLoader>
    </Suspense>
)

export default MessageLayout;