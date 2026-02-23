import { ICertificationRepository } from "../domain/ICertificationRepository"; 

export class GetOneCertificationUseCase {
  constructor(private readonly certificationRepository: ICertificationRepository) {}

  async execute(certificationId: string) {
    const result = await this.certificationRepository.findById(certificationId);

    if (!result) {
      throw new Error("Certification not found");
    }

    return result;
  }
}
