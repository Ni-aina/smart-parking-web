import { getConversationById, getMessagesByConversationId } from "@/actions/message.action";
import ThreadPane from "@/components/Messages/ThreadPane";

interface ConversationPageInterface {
    params: Promise<{ conversationId: string }>
}

const ConversationPage = async ({
    params
}: ConversationPageInterface) => {
    const { conversationId } = await params
    const [
        conversation,
        initialData
    ] = await Promise.all([
        getConversationById(conversationId),
        getMessagesByConversationId(conversationId, 1, 20)
    ])

    return (
        <ThreadPane
            conversation={conversation}
            initialData={initialData}
        />
    )
}

export default ConversationPage