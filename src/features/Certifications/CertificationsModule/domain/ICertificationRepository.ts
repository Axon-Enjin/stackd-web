import { Certification } from "./Certification";

export abstract class ICertificationRepository {
  abstract saveNewCertification(certification: Certification): Promise<Certification>;
  abstract persisUpdates(certification: Certification): Promise<Certification>;
  abstract deleteById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Certification | null>;
  abstract listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Certification[]; count: number }>;
  abstract listAll(): Promise<Certification[]>;
}
