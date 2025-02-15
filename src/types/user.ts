export interface UserInterface {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isVerified?: boolean;
}
