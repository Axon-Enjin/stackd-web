import { TeamsModuleController } from "./TeamsModuleController";
import { MemberRepository } from "./infrastructure/MemberRepository";
import { ImageService } from "./infrastructure/ImageService"; // Assuming this is your implementation
import { CreateMemberUseCase } from "./useCases/CreateMemberUseCase";
import { DeleteMemberUseCase } from "./useCases/DeleteMemberUseCase";
import { ListMembers } from "./useCases/ListMembers";
import { UpdateMemberUseCase } from "./useCases/UpdateMemberUseCase";
import { filesModuleController } from "@/features/FileSystem/FileSystemModule";

/**
 * 1. Infrastructure Dependencies
 * These are the low-level implementations (Supabase, Cloud Storage, etc.)
 */
const memberRepository = new MemberRepository();
const imageService = new ImageService(filesModuleController);

/**
 * 2. Use Cases
 * Injecting the repository and service into the business logic layer
 */
export const createMemberUseCase = new CreateMemberUseCase(
  memberRepository,
  imageService,
);

export const deleteMemberUseCase = new DeleteMemberUseCase(
  memberRepository,
  imageService,
);

export const listMembersUseCase = new ListMembers(memberRepository);

export const updateMemberUseCase = new UpdateMemberUseCase(
  memberRepository,
  imageService,
);

/**
 * 3. Exporting Default Controller
 * The controller serves as the public API for this module
 */
export const teamsModuleController = new TeamsModuleController(
  createMemberUseCase,
  deleteMemberUseCase,
  listMembersUseCase,
  updateMemberUseCase,
);

// Exporting the class type for type-safety in other modules
export * from "./TeamsModuleController";
