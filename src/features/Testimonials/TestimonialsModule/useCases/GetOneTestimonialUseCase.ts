import { ITestimonialRepository } from "../domain/ITestimonialRepository"; 

export class GetOneTestimonialUseCase {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(testimonialId: string) {
    const result = await this.testimonialRepository.findById(testimonialId);

    if (!result) {
      throw new Error("Testimonial not found");
    }

    return result;
  }
}
