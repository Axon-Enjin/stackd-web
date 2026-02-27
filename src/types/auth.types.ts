import { UserRole } from "@/features/Auth/AuthModule/domain/User";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserState {
  user: AuthUser | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (user: AuthUser) => void;
  logout: () => void;
}
