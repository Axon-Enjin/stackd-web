import { Booking } from "./Booking";

export interface IBookingRepository {
  getAvailableSlots(date: Date): Promise<Date[]>;
  createBooking(booking: Booking): Promise<Booking>;
}
