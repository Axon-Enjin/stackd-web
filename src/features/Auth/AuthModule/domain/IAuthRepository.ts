import { User } from "./User";

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getSession(): Promise<User | null>;
}
