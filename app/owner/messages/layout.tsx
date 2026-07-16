import MessageClient from "@/components/Messages/MessageClient";
import { ReactNode } from "react";

const MessageLayout = ({
    children
}: {
    children: ReactNode
}) => {
    return <MessageClient children={children} />
}

export default MessageLayout;