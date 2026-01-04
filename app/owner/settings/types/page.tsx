import { getTypes } from "@/actions/type.action";
import ClientType from "@/components/Types/ClientType";

const TypesPage = async () => {
    const types = await getTypes();

    return <ClientType types={types} />
}
 
export default TypesPage;