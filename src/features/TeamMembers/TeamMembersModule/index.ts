import { TeamMembersModuleController } from "./TeamMembersModuleController";
import { MemberRepository } from "./infrastructure/MemberRepository";
import { ImageService } from "./infrastructure/ImageService"; // Assuming this is your implementation
import { CreateMemberUseCase } from "./useCases/CreateMemberUseCase";
import { DeleteMemberUseCase } from "./useCases/DeleteMemberUseCase";
import { ListMembers } from "./useCases/ListMembers";
import { UpdateMemberUseCase } from "./useCases/UpdateMemberUseCase";
import { filesModuleController } from "@/features/FileSystem/FileSystemModule";
import { GetOneMember } from "./useCases/GetOneMemberUseCase";

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
const createMemberUseCase = new CreateMemberUseCase(
  memberRepository,
  imageService,
);

const deleteMemberUseCase = new DeleteMemberUseCase(
  memberRepository,
  imageService,
);

const listMembersUseCase = new ListMembers(memberRepository);

const updateMemberUseCase = new UpdateMemberUseCase(
  memberRepository,
  imageService,
);

const getOneMemberUseCase = new GetOneMember(memberRepository);

/**
 * 3. Exporting Default Controller
 * The controller serves as the public API for this module
 */
export const teamMembersModuleController = new TeamMembersModuleController(
  createMemberUseCase,
  deleteMemberUseCase,
  listMembersUseCase,
  updateMemberUseCase,
  getOneMemberUseCase,
);

// Exporting the class type for type-safety in other modules
export * from "./TeamMembersModuleController";
