import { CertificationsModuleController } from "./TeamMembersModuleController";
import { MemberRepository } from "./infrastructure/MemberRepository";
import { ImageService } from "./infrastructure/ImageService"; // Assuming this is your implementation
import { CreateCertificationUseCase } from "./useCases/CreateCertificationUseCase";
import { DeleteCertificationUseCase } from "./useCases/DeleteCertificationUseCase";
import { ListCertifications } from "./useCases/ListCertifications";
import { UpdateCertificationUseCase } from "./useCases/UpdateCertificationUseCase";
import { filesModuleController } from "@/features/FileSystem/FileSystemModule";
import { GetOneCertificationUseCase } from "./useCases/GetOneCertificationUseCase";

/**
 * 1. Infrastructure Dependencies
 * These are the low-level implementations (Supabase, Cloud Storage, etc.)
 */
const certificationRepository = new MemberRepository();
const imageService = new ImageService(filesModuleController);

/**
 * 2. Use Cases
 * Injecting the repository and service into the business logic layer
 */
export const createCertificationUseCase = new CreateCertificationUseCase(
  certificationRepository,
  imageService,
);

export const deleteCertificationUseCase = new DeleteCertificationUseCase(
  certificationRepository,
  imageService,
);

export const listCertificationsUseCase = new ListCertifications(certificationRepository);

export const updateCertificationUseCase = new UpdateCertificationUseCase(
  certificationRepository,
  imageService,
);

export const getOneCertificationUseCase = new GetOneCertificationUseCase(certificationRepository);

/**
 * 3. Exporting Default Controller
 * The controller serves as the public API for this module
 */
export const certificationsModuleController = new CertificationsModuleController(
  createCertificationUseCase,
  deleteCertificationUseCase,
  listCertificationsUseCase,
  updateCertificationUseCase,
  getOneCertificationUseCase,
);

// Exporting the class type for type-safety in other modules
export * from "./TeamMembersModuleController";
