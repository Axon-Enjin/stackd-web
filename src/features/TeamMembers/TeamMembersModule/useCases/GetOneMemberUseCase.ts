import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberCreateDTO } from "../domain/Member";

export class GetOneMember {
  constructor(private readonly memberRepository: IMemberRepository) {}

  async execute(memberId: string) {
    const result = await this.memberRepository.findById(memberId);

    if (!result) {
      throw new Error("Member not found");
    }

    return result;
  }
}
