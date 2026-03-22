import { ICustomAuthRepository, IEncryptionService, IJWTService } from "../domain/Interfaces";

export class LoginUseCase {
  constructor(
    private readonly repository: ICustomAuthRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly jwtService: IJWTService
  ) {}

  async execute(email: string, passwordRaw: string): Promise<string> {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials.");

    const isValid = await this.encryptionService.compare(passwordRaw, user.password);
    if (!isValid) throw new Error("Invalid credentials.");

    const token = await this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return token;
  }
}
