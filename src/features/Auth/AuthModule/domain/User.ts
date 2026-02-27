export type UserRole = "admin" | "user" | null;

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: UserRole,
  ) {}
}
