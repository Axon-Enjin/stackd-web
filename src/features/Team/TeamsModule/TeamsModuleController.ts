import { Member, MemberUpdateDTO } from "./domain/Member";
import { CreateMemberUseCase } from "./useCases/CreateMemberUseCase";
import { DeleteMemberUseCase } from "./useCases/DeleteMemberUseCase";
import { GetOneMember } from "./useCases/GetOneMemberUseCase";
import { ListMembers } from "./useCases/ListMembers";
import { UpdateMemberUseCase } from "./useCases/UpdateMemberUseCase";

export class TeamsModuleController {
  constructor(
    private createMemberUseCase: CreateMemberUseCase,
    private deleteMemberUseCase: DeleteMemberUseCase,
    private listMembersUseCase: ListMembers,
    private updateMemberUseCase: UpdateMemberUseCase,
    private getOneMemberUseCase: GetOneMember
  ) {}

  /**
   * Helper method to map the Domain Entity to a plain object
   */
  private mapMemberToResponse(member: Member) {
    return {
      id: member.props.id,
      imageUrl: member.props.image_url,
      firstName: member.props.firstName,
      middleName: member.props.middleName,
      lastName: member.props.lastName,
      role: member.props.role,
      bio: member.props.bio,
      rankingIndex: member.props.rankingIndex,
    };
  }

  async getOneMember(memberId: string) {
    const result = await this.getOneMemberUseCase.execute(memberId);
    return this.mapMemberToResponse(result);
  }

  async createMember(
    firstname: string,
    lastname: string,
    role: string,
    bio: string,
    image: File,
    middlename?: string,
  ) {
    const result = await this.createMemberUseCase.execute(
      {
        firstName: firstname,
        lastName: lastname,
        role: role,
        bio: bio,
        ...((middlename && { middleName: middlename }) || {}),
      },
      image,
    );
    return this.mapMemberToResponse(result);
  }

  async updateMember(
    memberId: string,
    memberRequestObj: MemberUpdateDTO,
    newImage?: File,
  ) {
    const result = await this.updateMemberUseCase.execute(
      memberId,
      memberRequestObj,
      newImage,
    );
    return this.mapMemberToResponse(result);
  }

  async deleteMember(memberId: string) {
    const result = await this.deleteMemberUseCase.execute(memberId);
    return result; // returns boolean
  }

  async listMembers(page: number, pageSize: number) {
    const result = await this.listMembersUseCase.execute(page, pageSize);

    return {
      list: result.list.map((member) => this.mapMemberToResponse(member)),
      count: result.count,
    };
  }
}
