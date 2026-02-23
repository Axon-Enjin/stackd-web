import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { Certification, CertificationCreateDTO } from "../domain/Certification";

export class CreateCertificationUseCase {
  constructor(
    private readonly memberRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(memberRequestObj: CertificationCreateDTO, image: File) {
    const imageUrl = await this.imageService.uploadFile(image);
    const newMember = Certification.create(imageUrl, memberRequestObj);
    await this.memberRepository.saveNewMember(newMember);

    return newMember;
  }
}
