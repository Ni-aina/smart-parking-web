import { getAgents } from "@/actions/profile.action";
import ClientAgent from "@/components/Agents/ClientAgent";

interface AgentsPageProps {
    searchParams: Promise<{ 
        page?: number;
        limit?: number;
        searchTerm: string 
    }>
}

const AgentsPage = async ({ searchParams }: AgentsPageProps) => {
    const {
        page,
        limit = 10,
        searchTerm = ""
    } = await searchParams;

    const agents = await getAgents(page, limit, searchTerm);
    const count = agents.length;

    return (
        <ClientAgent
            agents={agents}
            count={count}
            searchTerm={searchTerm}
        />
    )
}

export default AgentsPage;
