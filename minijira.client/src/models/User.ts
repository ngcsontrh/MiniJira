import { Dayjs } from "dayjs";

export interface User {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
}

export interface Login {
  username: string;
  password: string;
}

export interface ChangePassword {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export type UserRole = "Admin" | "User";