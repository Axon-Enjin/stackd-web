import { Testimonial } from "./Testimonial";

export abstract class ITestimonialRepository {
  abstract saveNew(testimonial: Testimonial): Promise<Testimonial>;
  abstract persistUpdates(testimonial: Testimonial): Promise<Testimonial>;
  abstract deleteById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Testimonial | null>;
  abstract listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Testimonial[]; count: number }>;
}
