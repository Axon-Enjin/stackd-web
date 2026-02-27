import { IAuthRepository } from "../domain/IAuthRepository";

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute() {
    return this.authRepository.logout();
  }
}
