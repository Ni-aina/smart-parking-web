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

export default PaymentInterface;
