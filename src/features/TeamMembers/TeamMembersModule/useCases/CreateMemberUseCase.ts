import { ApplicationError, LimitExceededError } from "@/lib/errors/ApplicationError";
import { IImageService } from "../domain/IImageService";
import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberCreateDTO } from "../domain/Member";

const MAX_TEAM_MEMBERS = 20;

export class CreateMemberUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly imageService: IImageService,
  ) { }

  async execute(memberRequestObj: MemberCreateDTO, image: File) {
    const currentCount = await this.memberRepository.countAll();
    if (currentCount >= MAX_TEAM_MEMBERS) {
      throw new LimitExceededError(
        `Cannot create more than ${MAX_TEAM_MEMBERS} team members`,
      );
    }

    const imageUrl = await this.imageService.uploadFile(image);
    const newMember = Member.create(imageUrl, memberRequestObj);
    await this.memberRepository.saveNewMember(newMember);

    return newMember;
  }
}
