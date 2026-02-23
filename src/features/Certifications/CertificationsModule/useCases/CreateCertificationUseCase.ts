import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { Certification, CertificationCreateDTO } from "../domain/Certification";

export class CreateCertificationUseCase {
  constructor(
    private readonly certificationRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(certificationRequestObj: CertificationCreateDTO, image: File) {
    const imageUrl = await this.imageService.uploadFile(image);
    const newCertification = Certification.create(imageUrl, certificationRequestObj);
    await this.certificationRepository.saveNewCertification(newCertification);

    return newCertification;
  }
}
