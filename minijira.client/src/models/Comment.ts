import { Dayjs } from "dayjs";

export interface Comment {
  id?: string;
  issueId?: string;
  userId?: string;
  content?: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
}