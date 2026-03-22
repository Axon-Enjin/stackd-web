export interface AuthUser {
  id: string;
  username: string;
}

export interface UserState {
  user: AuthUser | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
}
