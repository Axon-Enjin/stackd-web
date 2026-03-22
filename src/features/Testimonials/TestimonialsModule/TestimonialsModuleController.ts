import { Testimonial, TestimonialUpdateDTO } from "./domain/Testimonial";
import { CreateTestimonialUseCase } from "./useCases/CreateTestimonialUseCase";
import { DeleteTestimonialUseCase } from "./useCases/DeleteTestimonialUseCase";
import { GetOneTestimonialUseCase } from "./useCases/GetOneTestimonialUseCase";
import { ListTestimonials } from "./useCases/ListTestimonials";
import { UpdateTestimonialUseCase } from "./useCases/UpdateTestimonialUseCase";

export class TestimonialsModuleController {
  constructor(
    private createTestimonialUseCase: CreateTestimonialUseCase,
    private deleteTestimonialUseCase: DeleteTestimonialUseCase,
    private listTestimonialsUseCase: ListTestimonials,
    private updateTestimonialUseCase: UpdateTestimonialUseCase,
    private getOneTestimonialUseCase: GetOneTestimonialUseCase,
  ) { }

  /**
   * Helper method to map the Domain Entity to a plain object
   */
  private mapTestimonialToResponse(testimonial: Testimonial) {
    return {
      id: testimonial.props.id,
      imageUrl: testimonial.props.image_url,
      imageUrl64: testimonial.props.image_url_64 ?? null,
      imageUrl256: testimonial.props.image_url_256 ?? null,
      imageUrl512: testimonial.props.image_url_512 ?? null,
      companyLogoUrl: testimonial.props.company_logo_url ?? null,
      companyLogoUrl64: testimonial.props.company_logo_url_64 ?? null,
      companyLogoUrl256: testimonial.props.company_logo_url_256 ?? null,
      companyLogoUrl512: testimonial.props.company_logo_url_512 ?? null,
      title: testimonial.props.name,
      description: testimonial.props.role,
      company: testimonial.props.company ?? null,
      body: testimonial.props.body,
      rankingIndex: testimonial.props.rankingIndex,
    };
  }

  async getOneTestimonial(testimonialId: string) {
    const result = await this.getOneTestimonialUseCase.execute(testimonialId);
    return this.mapTestimonialToResponse(result);
  }

  async createTestimonial(
    name: string,
    role: string | null,
    company: string | null,
    body: string,
    image: File,
    companyLogo?: File,
  ) {
    const result = await this.createTestimonialUseCase.execute(
      {
        name: name,
        role: role,
        company: company,
        body: body,
      },
      image,
      companyLogo,
    );
    return this.mapTestimonialToResponse(result);
  }

  async updateTestimonial(
    testimonialId: string,
    testimonialRequestObj: TestimonialUpdateDTO,
    newImage?: File,
    rankingIndex?: number,
    newCompanyLogo?: File,
  ) {
    const result = await this.updateTestimonialUseCase.execute(
      testimonialId,
      testimonialRequestObj,
      newImage,
      rankingIndex,
      newCompanyLogo,
    );
    return this.mapTestimonialToResponse(result);
  }

  async deleteTestimonial(testimonialId: string) {
    const result =
      await this.deleteTestimonialUseCase.execute(testimonialId);
    return result; // returns boolean
  }

  async listTestimonials(page: number, pageSize: number) {
    const result = await this.listTestimonialsUseCase.execute(page, pageSize);

    return {
      list: result.list.map((testimonial) =>
        this.mapTestimonialToResponse(testimonial),
      ),
      count: result.count,
    };
  }

  async listAllTestimonials() {
    const result = await this.listTestimonialsUseCase.executeAll();

    return result.map((testimonial) =>
      this.mapTestimonialToResponse(testimonial),
    );
  }
}
