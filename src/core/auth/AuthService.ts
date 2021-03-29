export interface AuthService {
  login(username: string, password: string): Promise<unknown>;
  logout(): Promise<unknown>;
}
