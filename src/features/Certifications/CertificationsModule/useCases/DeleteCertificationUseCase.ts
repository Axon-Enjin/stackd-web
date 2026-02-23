import { IImageService } from "../domain/IImageService";
import { ICertificationRepository } from "../domain/ICertificationRepository";

export class DeleteCertificationUseCase {
  constructor(
    private readonly memberRepository: ICertificationRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(memberId: string) {
    /**
     * get member
     * delete member image
     * delete member record
     * return true
     */
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new Error("Member not found");
    }

    await this.imageService.deleteFile(member.props.image_url);
    await this.memberRepository.deleteById(memberId);

    return true;
  }
}
