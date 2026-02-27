import { SupabaseAuthRepository } from "./infrastructure/SupabaseAuthRepository";
import { LoginUseCase } from "./useCases/LoginUseCase";
import { LogoutUseCase } from "./useCases/LogoutUseCase";
import { GetSessionUseCase } from "./useCases/GetSessionUseCase";
import { AuthModuleController } from "./AuthModuleController";

const authRepository = new SupabaseAuthRepository();

const loginUseCase = new LoginUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getSessionUseCase = new GetSessionUseCase(authRepository);

export const authModuleController = new AuthModuleController(
  loginUseCase,
  logoutUseCase,
  getSessionUseCase,
);

export * from "./AuthModuleController";
