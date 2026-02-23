import { Member } from "./Member";

export abstract class IMemberRepository {
  abstract saveNewMember(member: Member): Promise<Member>;
  abstract persisUpdates(member: Member): Promise<Member>;
  abstract deleteById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Member | null>;
  abstract listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Member[]; count: number }>;
}
