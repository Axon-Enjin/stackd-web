import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";
import { 
  CertificationUpdateDTO,
} from "../domain/Certification";

export class UpdateCertificationUseCase {
  constructor(
    private readonly memberRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(
    memberId: string,
    memberRequestObj: CertificationUpdateDTO,
    newImage?: File,
  ) {
    /**
     * get member
     * apply updates
     * check if new image is provided
     * if new image, delete old image and upload new image then replace member image
     * persist updates
     * return updated member
     */
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new Error("Member not found");
    }

    member.update(memberRequestObj);

    if (newImage) {
      await this.imageService.deleteFile(member.props.image_url);
      const imageUrl = await this.imageService.uploadFile(newImage);
      member.setImageUrl(imageUrl);
    }

    await this.memberRepository.persisUpdates(member);

    return member;
  }
}
