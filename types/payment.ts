import { StatusType } from "./global";
import { ReservationInterface } from "./reservation";

export interface PaymentInterface {
    id: string;
    reservationId: string;
    reservation: ReservationInterface;
    amount: number;
    method: string | null;
    status: StatusType;
    transactionId: string | null;
    createdAt: string;
}

export interface BankAccountInterface {
    id: number;
    ownerId: string;
    bankName: string;
    accountHolder: string;
    routingNumber: string;
    cardNumber: string;
    expiredDate: string;
    createdAt: string;
    accountNumber: string;
}

export default PaymentInterface;
