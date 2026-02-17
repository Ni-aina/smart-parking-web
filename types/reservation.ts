import { ParkingInterface } from "./parking";
import { ProfileInterface } from "./profile";
import { StatusType } from "./global";
import { VehicleInterface } from "./vehicle";

export interface ReservationInterface {
  id: string;
  driverId: string;
  driver: ProfileInterface;
  lotId: string;
  lot: ParkingInterface;
  vehicle: VehicleInterface;
  startTime: string;
  endTime: string;
  status: StatusType;
  createdAt?: string;
}

export default ReservationInterface;
