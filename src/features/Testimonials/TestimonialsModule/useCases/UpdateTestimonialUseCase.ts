import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { TestimonialUpdateDTO } from "../domain/Testimonial";

export class UpdateTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) { }

  async execute(
    testimonialId: string,
    testimonialRequestObj: TestimonialUpdateDTO,
    newImage?: File,
    rankingIndex?: number,
    newCompanyLogo?: File,
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

    if (rankingIndex !== undefined) {
      testimonial.setRankingIndex(rankingIndex);
    }

    let oldImageUrl: string | null = null;
    if (newImage) {
      const uploadResult = await this.imageService.uploadFile(newImage);
      oldImageUrl = testimonial.props.image_url;
      testimonial.setImageUrls({
        url: uploadResult.url,
        url64: uploadResult.url64,
        url256: uploadResult.url256,
        url512: uploadResult.url512,
      });
    }

    let oldCompanyLogoUrl: string | null = null;
    if (newCompanyLogo) {
      const uploadResult = await this.imageService.uploadFile(newCompanyLogo);
      oldCompanyLogoUrl = testimonial.props.company_logo_url || null;
      testimonial.setCompanyLogoUrls({
        url: uploadResult.url,
        url64: uploadResult.url64,
        url256: uploadResult.url256,
        url512: uploadResult.url512,
      });
    }

    // persist updates first before deleting old image
    await this.testimonialRepository.persistUpdates(testimonial);

    if (oldImageUrl) {
      await this.imageService.deleteFile(oldImageUrl);
    }

    if (oldCompanyLogoUrl) {
      await this.imageService.deleteFile(oldCompanyLogoUrl);
    }

    return testimonial;
  }
}
