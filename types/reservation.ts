import { ParkingInterface } from "./parking";
import { ProfileInterface } from "./profile";
import { Status } from "./global";

export interface ReservationInterface {
  id: string;
  driverId: string;
  driver: ProfileInterface;
  lotId: string;
  lot: ParkingInterface;
  vehicleId?: string;
  startTime: string;
  endTime: string;
  status: Status;
  createdAt?: string;
}

export default ReservationInterface;
