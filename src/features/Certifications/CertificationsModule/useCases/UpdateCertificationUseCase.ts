import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { CertificationUpdateDTO } from "../domain/Certification";

export class UpdateCertificationUseCase {
  constructor(
    private readonly certificationRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) { }

  async execute(
    certificationId: string,
    certificationRequestObj: CertificationUpdateDTO,
    newImage?: File,
    rankingIndex?: number,
  ) {
    /**
     * get certification
     * apply updates
     * check if new image is provided
     * if new image, delete old image and upload new image then replace certification image
     * persist updates
     * return updated certification
     */
    const certification =
      await this.certificationRepository.findById(certificationId);

    if (!certification) {
      throw new Error("Certification not found");
    }

    certification.update(certificationRequestObj);

    if (rankingIndex !== undefined) {
      certification.setRankingIndex(rankingIndex);
    }

    if (newImage) {
      await this.imageService.deleteFile(certification.props.image_url);
      const imageUrl = await this.imageService.uploadFile(newImage);
      certification.setImageUrl(imageUrl);
    }

    await this.certificationRepository.persisUpdates(certification);

    return certification;
  }
}
