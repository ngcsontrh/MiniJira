import { Dayjs } from "dayjs";

export interface Project {
  id?: string;
  key?: string;
  name?: string;
  description?: string;
  ownerId?: string;
  ownerName?: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
  memberIds?: string[];
}

export interface ProjectFilter {
  pageIndex?: number;
  pageSize?: number;
  memberId?: string;
}