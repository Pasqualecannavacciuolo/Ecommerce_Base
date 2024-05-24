export interface User {
  id?: number;
  name?: string;
  email: string;
  password: string;
  access_token?: string | null;
  refresh_token?: string | null;
}
