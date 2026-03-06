import { getPaymentsForOwner } from "@/actions/transaction.action";
import TransactionsClient from "@/components/Transactions/TransactionClient";

interface TransactionsPageProps {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const TransactionsPage = async ({
    searchParams
}: {
    searchParams: Promise<TransactionsPageProps>
}) => {
    const { 
        page, 
        limit = 10, 
        searchTerm = "" 
    } = await searchParams;

    const transactions = await getPaymentsForOwner(page, limit, searchTerm);
    const { count } = transactions;

    return (
        <TransactionsClient
            transactions={transactions}
            count={count}
            searchTerm={searchTerm}
        />
    )
}

export default TransactionsPage;