import { IImageService } from "../domain/IImageService";
import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberCreateDTO } from "../domain/Member";

export class CreateMemberUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(memberRequestObj: MemberCreateDTO, image: File) {
    const imageUrl = await this.imageService.uploadFile(image);
    const newMember = Member.create(imageUrl, memberRequestObj);
    await this.memberRepository.saveNewMember(newMember);

    return newMember;
  }
}
