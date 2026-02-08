import { getTypes } from "@/actions/type.action";
import ClientType from "@/components/Types/ClientType";

interface TypesPageProps {
    page?: number;
    limit?: number;
}

const TypesPage = async ({
    searchParams
}: {
    searchParams: Promise<TypesPageProps>
}) => {
    const { page, limit = 10 } = await searchParams;
    const types = await getTypes(page, limit);
    const { count } = types;

    return (
        <ClientType
            types={types}
            count={count}
        />
    )
}

export default TypesPage;