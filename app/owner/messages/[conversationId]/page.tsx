import { getConversationById, getMessagesByConversationId } from "@/actions/message.action";
import ThreadPane from "@/components/Messages/ThreadPane";

interface ConversationPageInterface {
    params: Promise<{ conversationId: string }>
}

const ConversationPage = async ({
    params
}: ConversationPageInterface) => {

    const { conversationId } = await params;
    const [
        conversation,
        messages
    ] = await Promise.all([
        getConversationById(conversationId),
        getMessagesByConversationId(conversationId)
    ])

    return (
        <ThreadPane
            conversation={conversation}
            messages={messages}
        />
    )
}

export default ConversationPage;