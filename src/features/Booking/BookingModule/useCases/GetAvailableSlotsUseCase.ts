import { IBookingRepository } from "../domain/IBookingRepository";

export class GetAvailableSlotsUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(date: Date): Promise<Date[]> {
    return this.bookingRepository.getAvailableSlots(date);
  }
}
