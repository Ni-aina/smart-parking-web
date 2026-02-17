import { getPaymentsForOwner } from '@/actions/payments.action';
import PaymentClient from '@/components/Payments/PaymentClient';

interface PaymentsPageProps {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const PaymentsPage = async ({
    searchParams
}: {
    searchParams: Promise<PaymentsPageProps>
}) => {
    const { 
        page, 
        limit = 10, 
        searchTerm = "" 
    } = await searchParams;

    const payments = await getPaymentsForOwner(page, limit, searchTerm);
    const { count } = payments;

    return (
        <PaymentClient
            payments={payments}
            count={count}
        />
    )
}

export default PaymentsPage;