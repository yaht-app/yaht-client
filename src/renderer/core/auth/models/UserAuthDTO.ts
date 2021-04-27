export interface UserAuthDTO {
  id: number;
  email: string;
  role: string;
  username: string;
  token: string;
  reflection_on: string[];
  reflection_at: string[];
}
