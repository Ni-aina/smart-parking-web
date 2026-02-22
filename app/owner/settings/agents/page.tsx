import { getAgents } from "@/actions/profile.action";
import ClientAgent from "@/components/Agents/ClientAgent";

const AgentsPage = async () => {
    const agents = await getAgents();
    const count = agents.length;

    return (
        <ClientAgent
            agents={agents}
            count={count}
        />
    )
}

export default AgentsPage;
