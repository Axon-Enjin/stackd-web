import { ITestimonialRepository } from "../domain/ITestimonialRepository"; 

export class ListTestimonials {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(pageNumber: number, pageSize: number) {
    const result = await this.testimonialRepository.listPaginated(
      pageNumber,
      pageSize,
    );

    return result;
  }
}
