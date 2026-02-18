declare interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

declare interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
