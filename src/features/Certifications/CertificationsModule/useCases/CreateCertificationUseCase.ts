import { ApplicationError, LimitExceededError } from "@/lib/errors/ApplicationError";
import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { Certification, CertificationCreateDTO } from "../domain/Certification";

const MAX_CERTIFICATIONS = 40;

export class CreateCertificationUseCase {
  constructor(
    private readonly certificationRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) { }

  async execute(certificationRequestObj: CertificationCreateDTO, image: File) {
    const currentCount = await this.certificationRepository.countAll();
    if (currentCount >= MAX_CERTIFICATIONS) {
      throw new LimitExceededError(
        `Cannot create more than ${MAX_CERTIFICATIONS} certifications`,
      );
    }

    const imageUrl = await this.imageService.uploadFile(image);
    const newCertification = Certification.create(imageUrl, certificationRequestObj);
    await this.certificationRepository.saveNewCertification(newCertification);

    return newCertification;
  }
}
