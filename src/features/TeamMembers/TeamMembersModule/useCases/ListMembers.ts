import { IMemberRepository } from "../domain/IMemberRepository";
import { Member, MemberCreateDTO } from "../domain/Member";

export class ListMembers {
  constructor(private readonly memberRepository: IMemberRepository) { }

  async execute(pageNumber: number, pageSize: number) {
    const result = await this.memberRepository.listPaginated(
      pageNumber,
      pageSize,
    );

    return result;
  }

  async executeAll() {
    return this.memberRepository.listAll();
  }
}
