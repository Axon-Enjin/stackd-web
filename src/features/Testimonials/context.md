export abstract class IImageService {
  abstract uploadFile(file: File): Promise<string>; // takes file, returns public url of image

  abstract deleteFile(publicUrl: string): Promise<boolean>;
}
import { Testimonial } from "./Testimonial";

export abstract class ITestimonialRepository {
  abstract saveNew(testimonial: Testimonial): Promise<Testimonial>;
  abstract persistUpdates(testimonial: Testimonial): Promise<Testimonial>;
  abstract deleteById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Testimonial | null>;
  abstract listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Testimonial[]; count: number }>;
}
export type TestimonialProps = {
  image_url: string;
  title: string;
  description: string;
  body: string;

  // metadata
  id: string;
  rankingIndex: number;
};

export type TestimonialCreateDTO = Omit<
  TestimonialProps,
  "id" | "rankingIndex" | "image_url"
>;

export type TestimonialUpdateDTO = Partial<TestimonialCreateDTO>;

export class Testimonial {
  private _props: TestimonialProps;
  private constructor(props: TestimonialProps) {
    this._props = props;
  }

  get props() {
    return this._props;
  }

  static hydrate(props: TestimonialProps) {
    return new Testimonial(props);
  }

  static create(image_url: string, props: TestimonialCreateDTO) {
    return new Testimonial({
      ...props,
      id: crypto.randomUUID(),
      rankingIndex: Date.now(), // always returns a number higher than the last time you call it
      image_url,
    });
  }

  update(props: TestimonialUpdateDTO) {
    this._props = {
      ...this._props,
      ...props,
    };
  }

  setImageUrl(imageUrl: string) {
    this._props.image_url = imageUrl;
  }
}
import { FilesModuleController } from "@/features/FileSystem/FileSystemModule";
import { IImageService } from "../domain/IImageService";

export class ImageService implements IImageService {
  constructor(private readonly filesModuleController: FilesModuleController) {}

  async uploadFile(file: File): Promise<string> {
    const result = await this.filesModuleController.uploadFile(
      await file.arrayBuffer(),
      file.type,
      file.name,
      "This file is uploaded by the teams module.",
      "/teams-module/",
    );

    return result.previewUrl;
  }
  async deleteFile(publicUrl: string): Promise<boolean> {
    return await this.filesModuleController.deleteFileByPreviewUrl(publicUrl);
  }
}
import { supabaseAdminClient } from "@/lib/supabase";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { Testimonial, TestimonialProps } from "../domain/Testimonial";
import { Tables, TablesInsert } from "@/types/supabase.types";
// Adjust this import path to wherever your Database type is exported

type TestimonialRow = Tables<{ schema: "client_stackd" }, "testimonial">;
type TestimonialInsert = TablesInsert<
  { schema: "client_stackd" },
  "testimonial"
>;
supabaseAdminClient;

export class TestimonialRepository implements ITestimonialRepository {
  private readonly TABLE_NAME = "testimonial";

  // Maps Domain Model -> Database Insert/Update Model
  private toDb(props: TestimonialProps): TestimonialInsert {
    return {
      id: props.id,
      title: props.title,
      description: props.description,
      body: props.body,
      image_url: props.image_url,
      ranking_index: props.rankingIndex,
      updated_at: new Date().toISOString(), // Required by your Supabase Insert type
    };
  }

  // Maps Database Row -> Domain Model
  private toDomain(row: TestimonialRow): TestimonialProps {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      body: row.body,
      image_url: row.image_url,
      rankingIndex: row.ranking_index,
    };
  }

  async saveNew(
    testimonial: Testimonial,
  ): Promise<Testimonial> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .insert(this.toDb(testimonial.props))
      .select()
      .single();

    if (error)
      throw new Error(`Failed to save testimonial: ${error.message}`);
    return Testimonial.hydrate(this.toDomain(data));
  }

  async persistUpdates(testimonial: Testimonial): Promise<Testimonial> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .update(this.toDb(testimonial.props))
      .eq("id", testimonial.props.id)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update testimonial: ${error.message}`);
    return Testimonial.hydrate(this.toDomain(data));
  }

  async deleteById(id: string): Promise<boolean> {
    const { error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    return true;
  }

  async findById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error)
      throw new Error(`Failed to find testimonial: ${error.message}`);
    if (!data) return null;

    return Testimonial.hydrate(this.toDomain(data));
  }

  async listPaginated(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Testimonial[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdminClient
      .from(this.TABLE_NAME)
      .select("*", { count: "exact" })
      .order("ranking_index", { ascending: true }) // Fixed: Use DB column name, not camelCase
      .range(from, to);

    if (error)
      throw new Error(`Failed to list testimonial: ${error.message}`);

    return {
      list: (data || []).map((item) =>
        Testimonial.hydrate(this.toDomain(item)),
      ),
      count: count || 0,
    };
  }
}
import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { Testimonial, TestimonialCreateDTO } from "../domain/Testimonial";

export class CreateTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(testimonialRequestObj: TestimonialCreateDTO, image: File) {
    const imageUrl = await this.imageService.uploadFile(image);
    const newTestimonial = Testimonial.create(imageUrl, testimonialRequestObj);
    await this.testimonialRepository.saveNew(newTestimonial);

    return newTestimonial;
  }
}
import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";

export class DeleteTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(testimonialId: string) {
    /**
     * get testimonial
     * delete testimonial image
     * delete testimonial record
     * return true
     */
    const testimonial = await this.testimonialRepository.findById(testimonialId);

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    await this.imageService.deleteFile(testimonial.props.image_url);
    await this.testimonialRepository.deleteById(testimonialId);

    return true;
  }
}
import { ITestimonialRepository } from "../domain/ITestimonialRepository"; 

export class GetOneTestimonialUseCase {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async execute(testimonialId: string) {
    const result = await this.testimonialRepository.findById(testimonialId);

    if (!result) {
      throw new Error("Testimonial not found");
    }

    return result;
  }
}
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
import { IImageService } from "../domain/IImageService";
import { ITestimonialRepository } from "../domain/ITestimonialRepository";
import { TestimonialUpdateDTO } from "../domain/Testimonial";

export class UpdateTestimonialUseCase {
  constructor(
    private readonly testimonialRepository: ITestimonialRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute(
    testimonialId: string,
    testimonialRequestObj: TestimonialUpdateDTO,
    newImage?: File,
  ) {
    /**
     * get testimonial
     * apply updates
     * check if new image is provided
     * if new image, delete old image and upload new image then replace testimonial image
     * persist updates
     * return updated testimonial
     */
    const testimonial =
      await this.testimonialRepository.findById(testimonialId);

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    testimonial.update(testimonialRequestObj);

    if (newImage) {
      await this.imageService.deleteFile(testimonial.props.image_url);
      const imageUrl = await this.imageService.uploadFile(newImage);
      testimonial.setImageUrl(imageUrl);
    }

    await this.testimonialRepository.persistUpdates(testimonial);

    return testimonial;
  }
}
import { TestimonialsModuleController } from "./TestimonialsModuleController";
import { TestimonialRepository } from "./infrastructure/TestimonialRepository";
import { ImageService } from "./infrastructure/ImageService"; // Assuming this is your implementation
import { CreateTestimonialUseCase } from "./useCases/CreateTestimonialUseCase";
import { DeleteTestimonialUseCase } from "./useCases/DeleteTestimonialUseCase";
import { ListTestimonials } from "./useCases/ListTestimonials";
import { UpdateTestimonialUseCase } from "./useCases/UpdateTestimonialUseCase";
import { filesModuleController } from "@/features/FileSystem/FileSystemModule";
import { GetOneTestimonialUseCase } from "./useCases/GetOneTestimonialUseCase";

/**
 * 1. Infrastructure Dependencies
 * These are the low-level implementations (Supabase, Cloud Storage, etc.)
 */
const testimonialRepository = new TestimonialRepository();
const imageService = new ImageService(filesModuleController);

/**
 * 2. Use Cases
 * Injecting the repository and service into the business logic layer
 */
const createTestimonialUseCase = new CreateTestimonialUseCase(
  testimonialRepository,
  imageService,
);

const deleteTestimonialnUseCase = new DeleteTestimonialUseCase(
  testimonialRepository,
  imageService,
);

const listTestimonialsUseCase = new ListTestimonials(
  testimonialRepository,
);

const updateTestimonialUseCase = new UpdateTestimonialUseCase(
  testimonialRepository,
  imageService,
);

const getOneTestimonialUseCase = new GetOneTestimonialUseCase(
  testimonialRepository,
);

/**
 * 3. Exporting Default Controller
 * The controller serves as the public API for this module
 */
export const testimonialsModuleController =
  new TestimonialsModuleController(
    createTestimonialUseCase,
    deleteTestimonialnUseCase,
    listTestimonialsUseCase,
    updateTestimonialUseCase,
    getOneTestimonialUseCase,
  );

// Exporting the class type for type-safety in other modules
export * from "./TestimonialsModuleController";
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
  ) {}

  /**
   * Helper method to map the Domain Entity to a plain object
   */
  private mapTestimonialToResponse(testimonial: Testimonial) {
    return {
      id: testimonial.props.id,
      imageUrl: testimonial.props.image_url,
      title: testimonial.props.title,
      description: testimonial.props.description,
      rankingIndex: testimonial.props.rankingIndex,
    };
  }

  async getOneTestimonial(testimonialId: string) {
    const result =
      await this.getOneTestimonialUseCase.execute(testimonialId);
    return this.mapTestimonialToResponse(result);
  }

  async createTestimonial(title: string, description: string, body: string, image: File) {
    const result = await this.createTestimonialUseCase.execute(
      {
        title: title,
        description: description,
        body: body,
      },
      image,
    );
    return this.mapTestimonialToResponse(result);
  }

  async updateTestimonial(
    testimonialId: string,
    testimonialRequestObj: TestimonialUpdateDTO,
    newImage?: File,
  ) {
    const result = await this.updateTestimonialUseCase.execute(
      testimonialId,
      testimonialRequestObj,
      newImage,
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
}
