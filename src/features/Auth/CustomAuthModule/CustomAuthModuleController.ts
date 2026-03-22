import { CreateUserUseCase } from "./useCases/CreateUserUseCase";
import { DeleteUserUseCase } from "./useCases/DeleteUserUseCase";
import { ChangeUsernameUseCase } from "./useCases/ChangeUsernameUseCase";
import { ChangePasswordUseCase } from "./useCases/ChangePasswordUseCase";
import { ChangeEmailUseCase } from "./useCases/ChangeEmailUseCase";
import { LoginUseCase } from "./useCases/LoginUseCase";

export class CustomAuthModuleController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changeUsernameUseCase: ChangeUsernameUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly changeEmailUseCase: ChangeEmailUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async createUser(email: string, username: string, passwordRaw: string) {
    const user = await this.createUserUseCase.execute(email, username, passwordRaw);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async deleteUser(email: string) {
    return await this.deleteUserUseCase.execute(email);
  }

  async changeUsername(email: string, newUsername: string, passwordRaw: string) {
    const user = await this.changeUsernameUseCase.execute(email, newUsername, passwordRaw);
    return {
      email: user.email,
      username: user.username,
    };
  }

  async changePassword(email: string, newPasswordRaw: string, oldPasswordRaw: string) {
    await this.changePasswordUseCase.execute(email, newPasswordRaw, oldPasswordRaw);
    return { success: true };
  }

  async changeEmail(email: string, newEmail: string, passwordRaw: string) {
    const user = await this.changeEmailUseCase.execute(email, newEmail, passwordRaw);
    return {
      email: user.email,
      username: user.username,
    };
  }

  async login(email: string, passwordRaw: string) {
    const token = await this.loginUseCase.execute(email, passwordRaw);
    return { token };
  }
}
