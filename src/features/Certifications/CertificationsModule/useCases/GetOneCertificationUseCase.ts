import { ICertificationRepository } from "../domain/ICertificationRepository"; 

export class GetOneCertificationUseCase {
  constructor(private readonly memberRepository: ICertificationRepository) {}

  async execute(memberId: string) {
    const result = await this.memberRepository.findById(memberId);

    if (!result) {
      throw new Error("Member not found");
    }

    return result;
  }
}
