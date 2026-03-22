import { ICustomAuthRepository, IEncryptionService } from "../domain/Interfaces";
import { User } from "../domain/User";

export class ChangeEmailUseCase {
  constructor(
    private readonly repository: ICustomAuthRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(currentEmail: string, newEmail: string, passwordRaw: string): Promise<User> {
    const user = await this.repository.findByEmail(currentEmail);
    if (!user) throw new Error("User not found.");

    const isValid = await this.encryptionService.compare(passwordRaw, user.password);
    if (!isValid) throw new Error("Invalid credentials.");

    const existing = await this.repository.findByEmail(newEmail);
    if (existing) throw new Error("New email already in use.");

    user.update({ email: newEmail });
    await this.repository.persistUpdates(user);
    return user;
  }
}
