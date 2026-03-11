import { ApplicationError, LimitExceededError } from "@/lib/errors/ApplicationError";
import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { Testimonial, TestimonialCreateDTO } from "../domain/Testimonial";

const MAX_TESTIMONIALS = 40;

export class CreateTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) { }

  async execute(testimonialRequestObj: TestimonialCreateDTO, image: File) {
    const currentCount = await this.testimonialRepository.countAll();
    if (currentCount >= MAX_TESTIMONIALS) {
      throw new LimitExceededError(
        `Cannot create more than ${MAX_TESTIMONIALS} testimonials`,
      );
    }

    const uploadResult = await this.imageService.uploadFile(image);
    const newTestimonial = Testimonial.create(uploadResult.url, testimonialRequestObj, {
      url64: uploadResult.url64,
      url256: uploadResult.url256,
      url512: uploadResult.url512,
    });
    await this.testimonialRepository.saveNew(newTestimonial);

    return newTestimonial;
  }
}
