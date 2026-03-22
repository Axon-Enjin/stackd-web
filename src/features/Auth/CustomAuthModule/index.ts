import { CustomAuthModuleController } from "./CustomAuthModuleController";
import { MockCustomAuthRepository } from "./infrastructure/MockCustomAuthRepository";
import { MockEncryptionService, MockJWTService } from "./infrastructure/MockServices";
import { CreateUserUseCase } from "./useCases/CreateUserUseCase";
import { DeleteUserUseCase } from "./useCases/DeleteUserUseCase";
import { ChangeUsernameUseCase } from "./useCases/ChangeUsernameUseCase";
import { ChangePasswordUseCase } from "./useCases/ChangePasswordUseCase";
import { ChangeEmailUseCase } from "./useCases/ChangeEmailUseCase";
import { LoginUseCase } from "./useCases/LoginUseCase";

// In production, you would use SupabaseCustomAuthRepository and real Encryption/JWT services
const repository = new MockCustomAuthRepository();
const encryptionService = new MockEncryptionService();
const jwtService = new MockJWTService();

const createUserUseCase = new CreateUserUseCase(repository, encryptionService);
const deleteUserUseCase = new DeleteUserUseCase(repository);
const changeUsernameUseCase = new ChangeUsernameUseCase(repository, encryptionService);
const changePasswordUseCase = new ChangePasswordUseCase(repository, encryptionService);
const changeEmailUseCase = new ChangeEmailUseCase(repository, encryptionService);
const loginUseCase = new LoginUseCase(repository, encryptionService, jwtService);

export const customAuthModuleController = new CustomAuthModuleController(
  createUserUseCase,
  deleteUserUseCase,
  changeUsernameUseCase,
  changePasswordUseCase,
  changeEmailUseCase,
  loginUseCase
);

export * from "./CustomAuthModuleController";
export * from "./domain/User";
export * from "./domain/Interfaces";
