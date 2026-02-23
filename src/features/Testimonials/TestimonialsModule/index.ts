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
