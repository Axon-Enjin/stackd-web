import { Booking } from "../domain/Booking";
import { IBookingRepository } from "../domain/IBookingRepository";

export class CreateBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(
    name: string,
    email: string,
    startTime: Date,
    durationMinutes: number = 30,
  ): Promise<Booking> {
    if (!name || !email || !startTime) {
      throw new Error("Missing required booking fields.");
    }

    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    const newBooking = new Booking(name, email, startTime, endTime);

    return this.bookingRepository.createBooking(newBooking);
  }
}
