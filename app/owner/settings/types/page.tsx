import { getTypes } from "@/actions/type.action";
import ClientType from "@/components/Types/ClientType";

interface TypesPageProps {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const TypesPage = async ({
    searchParams
}: {
    searchParams: Promise<TypesPageProps>
}) => {
    const { 
        page,
        limit = 10,
        searchTerm = ""
    } = await searchParams;
    const types = await getTypes(page, limit, searchTerm);
    const { count } = types;

    return (
        <ClientType
            types={types}
            count={count}
            searchTerm={searchTerm}
        />
    )
}

export default TypesPage;