import { IMemberRepository } from "../domain/IMemberRepository";
import { Member } from "../domain/Member";

export class GetMemberByNameUseCase {
    constructor(private memberRepository: IMemberRepository) { }

    async execute(name: string): Promise<Member> {
        const member = await this.memberRepository.findByName(name);

        if (!member) {
            throw new Error("Team member not found");
        }

        return member;
    }
}
