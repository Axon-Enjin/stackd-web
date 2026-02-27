import { CertificationsModuleController } from "./CertificationsModuleController";
import { CertificationRepository } from "./infrastructure/CertificationRepository";
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
const certificationRepository = new CertificationRepository();
const imageService = new ImageService(filesModuleController);

/**
 * 2. Use Cases
 * Injecting the repository and service into the business logic layer
 */
const createCertificationUseCase = new CreateCertificationUseCase(
  certificationRepository,
  imageService,
);

const deleteCertificationUseCase = new DeleteCertificationUseCase(
  certificationRepository,
  imageService,
);

const listCertificationsUseCase = new ListCertifications(
  certificationRepository,
);

const updateCertificationUseCase = new UpdateCertificationUseCase(
  certificationRepository,
  imageService,
);

const getOneCertificationUseCase = new GetOneCertificationUseCase(
  certificationRepository,
);

/**
 * 3. Exporting Default Controller
 * The controller serves as the public API for this module
 */
export const certificationsModuleController =
  new CertificationsModuleController(
    createCertificationUseCase,
    deleteCertificationUseCase,
    listCertificationsUseCase,
    updateCertificationUseCase,
    getOneCertificationUseCase,
  );

// Exporting the class type for type-safety in other modules
export * from "./CertificationsModuleController";
