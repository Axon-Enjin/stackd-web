import { Certification, CertificationUpdateDTO } from "./domain/Certification";
import { CreateCertificationUseCase } from "./useCases/CreateCertificationUseCase";
import { DeleteCertificationUseCase } from "./useCases/DeleteCertificationUseCase";
import { GetOneCertificationUseCase } from "./useCases/GetOneCertificationUseCase";
import { ListCertifications } from "./useCases/ListCertifications";
import { UpdateCertificationUseCase } from "./useCases/UpdateCertificationUseCase";

export class CertificationsModuleController {
  constructor(
    private createMemberUseCase: CreateCertificationUseCase,
    private deleteMemberUseCase: DeleteCertificationUseCase,
    private listMembersUseCase: ListCertifications,
    private updateMemberUseCase: UpdateCertificationUseCase,
    private getOneMemberUseCase: GetOneCertificationUseCase
  ) {}

  /**
   * Helper method to map the Domain Entity to a plain object
   */
  private mapCertificationToResponse(member: Certification) {
    return {
      id: member.props.id,
      imageUrl: member.props.image_url,
      firstName: member.props.title, 
      lastName: member.props.description, 
      rankingIndex: member.props.rankingIndex,
    };
  }

  async getOneCertification(memberId: string) {
    const result = await this.getOneMemberUseCase.execute(memberId);
    return this.mapCertificationToResponse(result);
  }

  async createCertification(
    title: string,
    description: string, 
    image: File, 
  ) {
    const result = await this.createMemberUseCase.execute(
      {
        title: title,
        description: description,   
      },
      image,
    );
    return this.mapCertificationToResponse(result);
  }

  async updateCertification(
    memberId: string,
    memberRequestObj: CertificationUpdateDTO,
    newImage?: File,
  ) {
    const result = await this.updateMemberUseCase.execute(
      memberId,
      memberRequestObj,
      newImage,
    );
    return this.mapCertificationToResponse(result);
  }

  async deleteCertification(memberId: string) {
    const result = await this.deleteMemberUseCase.execute(memberId);
    return result; // returns boolean
  }

  async listCertifications(page: number, pageSize: number) {
    const result = await this.listMembersUseCase.execute(page, pageSize);

    return {
      list: result.list.map((member) => this.mapCertificationToResponse(member)),
      count: result.count,
    };
  }
}
