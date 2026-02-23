import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { TestimonialUpdateDTO } from "../domain/Testimonial";

export class UpdateTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(
    testimonialId: string,
    testimonialRequestObj: TestimonialUpdateDTO,
    newImage?: File,
  ) {
    /**
     * get testimonial
     * apply updates
     * check if new image is provided
     * if new image, delete old image and upload new image then replace testimonial image
     * persist updates
     * return updated testimonial
     */
    const testimonial =
      await this.testimonialRepository.findById(testimonialId);

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    testimonial.update(testimonialRequestObj);

    let oldImageUrl: string | null = null;
    if (newImage) {
      const imageUrl = await this.imageService.uploadFile(newImage);
      oldImageUrl = testimonial.props.image_url;
      testimonial.setImageUrl(imageUrl);
    }

    // persist updates first before deleting old image
    await this.testimonialRepository.persistUpdates(testimonial);

    if (oldImageUrl) {
      await this.imageService.deleteFile(oldImageUrl);
    }

    return testimonial;
  }
}
