import { LotInterface } from "./lot";
import { ProfileInterface } from "./profile";
import { StatusType } from "./global";
import { VehicleInterface } from "./vehicle";

export interface ReservationInterface {
  id: string;
  driverId: string;
  driver: ProfileInterface;
  lotId: string;
  lot: LotInterface;
  vehicle: VehicleInterface;
  startTime: string;
  endTime: string;
  status: StatusType;
  createdAt?: string;
}

export interface ReservationFormInterface {
  lotId: string;
  driverId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  amount: number | string;
}

export default ReservationInterface;
