import { IAuthRepository } from "../domain/IAuthRepository";

export class GetSessionUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute() {
    return this.authRepository.getSession();
  }
}
