import { Certification, CertificationUpdateDTO } from "./domain/Certification";
import { CreateCertificationUseCase } from "./useCases/CreateCertificationUseCase";
import { DeleteCertificationUseCase } from "./useCases/DeleteCertificationUseCase";
import { GetOneCertificationUseCase } from "./useCases/GetOneCertificationUseCase";
import { ListCertifications } from "./useCases/ListCertifications";
import { UpdateCertificationUseCase } from "./useCases/UpdateCertificationUseCase";

export class CertificationsModuleController {
  constructor(
    private createCertificationUseCase: CreateCertificationUseCase,
    private deleteCertificationUseCase: DeleteCertificationUseCase,
    private listCertificationsUseCase: ListCertifications,
    private updateCertificationUseCase: UpdateCertificationUseCase,
    private getOneCertificationUseCase: GetOneCertificationUseCase,
  ) {}

  /**
   * Helper method to map the Domain Entity to a plain object
   */
  private mapCertificationToResponse(certification: Certification) {
    return {
      id: certification.props.id,
      imageUrl: certification.props.image_url,
      title: certification.props.title,
      description: certification.props.description,
      rankingIndex: certification.props.rankingIndex,
    };
  }

  async getOneCertification(certificationId: string) {
    const result =
      await this.getOneCertificationUseCase.execute(certificationId);
    return this.mapCertificationToResponse(result);
  }

  async createCertification(title: string, description: string, image: File) {
    const result = await this.createCertificationUseCase.execute(
      {
        title: title,
        description: description,
      },
      image,
    );
    return this.mapCertificationToResponse(result);
  }

  async updateCertification(
    certificationId: string,
    certificationRequestObj: CertificationUpdateDTO,
    newImage?: File,
  ) {
    const result = await this.updateCertificationUseCase.execute(
      certificationId,
      certificationRequestObj,
      newImage,
    );
    return this.mapCertificationToResponse(result);
  }

  async deleteCertification(certificationId: string) {
    const result =
      await this.deleteCertificationUseCase.execute(certificationId);
    return result; // returns boolean
  }

  async listCertifications(page: number, pageSize: number) {
    const result = await this.listCertificationsUseCase.execute(page, pageSize);

    return {
      list: result.list.map((certification) =>
        this.mapCertificationToResponse(certification),
      ),
      count: result.count,
    };
  }
}
