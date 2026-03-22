import { ICustomAuthRepository } from "../domain/Interfaces";

export class DeleteUserUseCase {
  constructor(private readonly repository: ICustomAuthRepository) {}

  async execute(email: string): Promise<boolean> {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found.");

    return await this.repository.deleteByEmail(email);
  }
}
