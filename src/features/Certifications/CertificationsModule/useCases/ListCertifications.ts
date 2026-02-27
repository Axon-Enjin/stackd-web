import { ICertificationRepository } from "../domain/ICertificationRepository"; 

export class ListCertifications {
  constructor(private readonly certificationRepository: ICertificationRepository) {}

  async execute(pageNumber: number, pageSize: number) {
    const result = await this.certificationRepository.listPaginated(
      pageNumber,
      pageSize,
    );

    return result;
  }
}
