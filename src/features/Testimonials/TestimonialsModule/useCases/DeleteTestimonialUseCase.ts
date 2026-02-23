import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";

export class DeleteTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(testimonialId: string) {
    /**
     * get testimonial
     * delete testimonial image
     * delete testimonial record
     * return true
     */
    const testimonial = await this.testimonialRepository.findById(testimonialId);

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    await this.imageService.deleteFile(testimonial.props.image_url);
    await this.testimonialRepository.deleteById(testimonialId);

    return true;
  }
}
