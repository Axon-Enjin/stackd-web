import { IImageService } from "../domain/IImageService";
import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberCreateDTO, MemberUpdateDTO } from "../domain/Member";

export class UpdateMemberUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly imageService: IImageService,
  ) { }

  async execute(
    memberId: string,
    memberRequestObj: MemberUpdateDTO,
    newImage?: File,
    rankingIndex?: number,
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

    if (rankingIndex !== undefined) {
      member.setRankingIndex(rankingIndex);
    }

    if (newImage) {
      await this.imageService.deleteFile(member.props.image_url);
      const imageUrl = await this.imageService.uploadFile(newImage);
      member.setImageUrl(imageUrl);
    }

    await this.memberRepository.persistUpdates(member);

    return member;
  }
}
