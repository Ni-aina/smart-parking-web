import ThreadPane from "@/components/Messages/ThreadPane";

interface ConversationPageInterface {
    params: Promise<{ conversationId: string }>
}

const ConversationPage = async ({
    params
}: ConversationPageInterface) => {

    const { conversationId } = await params;

    return (
        <ThreadPane conversationId={conversationId} />
    )
}

export default ConversationPage;