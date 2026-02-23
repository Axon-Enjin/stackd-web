import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { Testimonial, TestimonialCreateDTO } from "../domain/Testimonial";

export class CreateTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(testimonialRequestObj: TestimonialCreateDTO, image: File) {
    const imageUrl = await this.imageService.uploadFile(image);
    const newTestimonial = Testimonial.create(imageUrl, testimonialRequestObj);
    await this.testimonialRepository.saveNew(newTestimonial);

    return newTestimonial;
  }
}
