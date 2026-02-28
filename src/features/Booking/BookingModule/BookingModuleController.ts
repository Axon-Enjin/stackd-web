import { Booking } from "./domain/Booking";
import { CreateBookingUseCase } from "./useCases/CreateBookingUseCase";
import { GetAvailableSlotsUseCase } from "./useCases/GetAvailableSlotsUseCase";

export class BookingModuleController {
  constructor(
    private getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
    private createBookingUseCase: CreateBookingUseCase,
  ) {}

  async getAvailableSlots(dateString: string, timezone: string = "UTC") {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format.");
    }

    return this.getAvailableSlotsUseCase.execute(date, timezone);
  }

  async createBooking(name: string, email: string, startTimeString: string) {
    const startTime = new Date(startTimeString);
    if (isNaN(startTime.getTime())) {
      throw new Error("Invalid start time format.");
    }

    return this.createBookingUseCase.execute(name, email, startTime);
  }
}
