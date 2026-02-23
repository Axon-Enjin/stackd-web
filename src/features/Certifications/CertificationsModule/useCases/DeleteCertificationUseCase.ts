import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";

export class DeleteCertificationUseCase {
  constructor(
    private readonly certificationRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(certificationId: string) {
    /**
     * get certification
     * delete certification image
     * delete certification record
     * return true
     */
    const certification = await this.certificationRepository.findById(certificationId);

    if (!certification) {
      throw new Error("Certification not found");
    }

    await this.imageService.deleteFile(certification.props.image_url);
    await this.certificationRepository.deleteById(certificationId);

    return true;
  }
}
