export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface UserState {
  user: AuthUser | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (user: AuthUser) => void;
  logout: () => void;
}
