import { IAuthRepository } from "../domain/IAuthRepository";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string) {
    return this.authRepository.login(email, password);
  }
}
