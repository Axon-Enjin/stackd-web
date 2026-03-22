import { IJWTService, ICustomAuthRepository } from "../domain/Interfaces";

export class VerifyTokenUseCase {
  constructor(
    private readonly jwtService: IJWTService,
    private readonly repository: ICustomAuthRepository
  ) {}

  async execute(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      if (!payload || !payload.username) return null;

      const user = await this.repository.findByUsername(payload.username);
      if (!user) return null;

      return {
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      return null;
    }
  }
}
