import { IImageService } from "../domain/IImageService";
import { IMemberRepository } from "../domain/IMemberRepository";

export class DeleteMemberUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
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
