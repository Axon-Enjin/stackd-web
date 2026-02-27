import { GoogleCalendarRepository } from "./infrastructure/GoogleCalendarRepository";
import { CreateBookingUseCase } from "./useCases/CreateBookingUseCase";
import { GetAvailableSlotsUseCase } from "./useCases/GetAvailableSlotsUseCase";
import { BookingModuleController } from "./BookingModuleController";

const bookingRepository = new GoogleCalendarRepository();

const getAvailableSlotsUseCase = new GetAvailableSlotsUseCase(
  bookingRepository,
);
const createBookingUseCase = new CreateBookingUseCase(bookingRepository);

export const bookingModuleController = new BookingModuleController(
  getAvailableSlotsUseCase,
  createBookingUseCase,
);

export * from "./BookingModuleController";
