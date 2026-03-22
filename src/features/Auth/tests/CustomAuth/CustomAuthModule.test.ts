import { describe, it, expect, beforeEach } from "vitest";
import { MockCustomAuthRepository } from "../../CustomAuthModule/infrastructure/MockCustomAuthRepository";
import { MockEncryptionService, MockJWTService } from "../../CustomAuthModule/infrastructure/MockServices";
import { CreateUserUseCase } from "../../CustomAuthModule/useCases/CreateUserUseCase";
import { LoginUseCase } from "../../CustomAuthModule/useCases/LoginUseCase";
import { ChangeUsernameUseCase } from "../../CustomAuthModule/useCases/ChangeUsernameUseCase";
import { DeleteUserUseCase } from "../../CustomAuthModule/useCases/DeleteUserUseCase";

describe("CustomAuthModule Use Cases", () => {
  let repository: MockCustomAuthRepository;
  let encryptionService: MockEncryptionService;
  let jwtService: MockJWTService;

  beforeEach(() => {
    repository = new MockCustomAuthRepository();
    encryptionService = new MockEncryptionService();
    jwtService = new MockJWTService();
  });

  it("should create a new user and login successfully", async () => {
    const createUser = new CreateUserUseCase(repository, encryptionService);
    const login = new LoginUseCase(repository, encryptionService, jwtService);

    const email = "test@example.com";
    const username = "testuser";
    const password = "password123";

    await createUser.execute(email, username, password);
    const token = await login.execute(email, password);

    expect(token).toContain("token_");
    const decoded = await jwtService.verify(token);
    expect(decoded.email).toBe(email);
    expect(decoded.username).toBe(username);
  });

  it("should fail to create user with duplicate email", async () => {
    const createUser = new CreateUserUseCase(repository, encryptionService);
    const email = "test@example.com";
    await createUser.execute(email, "user1", "pass1");
    await expect(createUser.execute(email, "user2", "pass2")).rejects.toThrow("Email already in use.");
  });

  it("should change username successfully", async () => {
    const createUser = new CreateUserUseCase(repository, encryptionService);
    const changeUsername = new ChangeUsernameUseCase(repository, encryptionService);
    
    const email = "test@example.com";
    await createUser.execute(email, "oldname", "pass123");
    
    const updatedUser = await changeUsername.execute(email, "newname", "pass123");
    expect(updatedUser.username).toBe("newname");
    
    const found = await repository.findByEmail(email);
    expect(found?.username).toBe("newname");
  });

  it("should delete user successfully", async () => {
    const createUser = new CreateUserUseCase(repository, encryptionService);
    const deleteUser = new DeleteUserUseCase(repository);
    
    const email = "test@example.com";
    await createUser.execute(email, "user1", "pass1");
    
    const result = await deleteUser.execute(email);
    expect(result).toBe(true);
    
    const found = await repository.findByEmail(email);
    expect(found).toBeNull();
  });
});
