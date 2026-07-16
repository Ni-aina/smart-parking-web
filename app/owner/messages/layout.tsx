import { getConversationsByUser } from "@/actions/message.action";
import MessageClient from "@/components/Messages/MessageClient";
import { ReactNode } from "react";

const MessageLayout = async ({
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

export default MessageLayout;