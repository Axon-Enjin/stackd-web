import { Booking } from "./Booking";

export interface IBookingRepository {
  getAvailableSlots(date: Date, timezone?: string): Promise<Date[]>;
  createBooking(booking: Booking): Promise<Booking>;
}
