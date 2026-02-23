import { ICertificationRepository } from "../domain/ICertificationRepository"; 

export class ListCertifications {
  constructor(private readonly memberRepository: ICertificationRepository) {}

  async execute(pageNumber: number, pageSize: number) {
    const result = await this.memberRepository.listPaginated(
      pageNumber,
      pageSize,
    );

    return result;
  }
}
