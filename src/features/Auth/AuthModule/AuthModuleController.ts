import { User } from "./domain/User";
import { LoginUseCase } from "./useCases/LoginUseCase";
import { LogoutUseCase } from "./useCases/LogoutUseCase";
import { GetSessionUseCase } from "./useCases/GetSessionUseCase";

export class AuthModuleController {
  constructor(
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase,
    private getSessionUseCase: GetSessionUseCase,
  ) {}

  private mapUserToResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = await this.loginUseCase.execute(email, password);
    return this.mapUserToResponse(user);
  }

  async logout() {
    await this.logoutUseCase.execute();
  }

  async getSession() {
    const user = await this.getSessionUseCase.execute();
    return user ? this.mapUserToResponse(user) : null;
  }
}
