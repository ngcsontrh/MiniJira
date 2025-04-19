import { Dayjs } from "dayjs";

export interface ProjectMember {
  id?: string;
  projectId?: string;
  memberId?: string;
  role?: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
}

export type ProjectMemberRole = "owner" | "developer" | "tester";