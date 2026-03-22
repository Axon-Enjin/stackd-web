import { User } from "../domain/User";
import { ICustomAuthRepository, IEncryptionService } from "../domain/Interfaces";

export class CreateUserUseCase {
  constructor(
    private readonly repository: ICustomAuthRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(email: string, username: string, passwordRaw: string): Promise<User> {
    const existing = await this.repository.findByEmail(email);
    if (existing) throw new Error("Email already in use.");

    const existingUser = await this.repository.findByUsername(username);
    if (existingUser) throw new Error("Username already in use.");

    const hashedPassword = await this.encryptionService.hash(passwordRaw);

    const user = User.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.repository.saveNew(user);
    return user;
  }
}
