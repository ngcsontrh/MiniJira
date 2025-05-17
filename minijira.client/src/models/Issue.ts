import { Dayjs } from "dayjs";

export interface Issue {
  id?: string;
  key?: string;
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
  projectId?: string;
  projectName?: string;
  reporterId?: string;
  reporterName?: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
  attachmentIds?: string[];
  attachmentUrls?: string[];
  logs?: string[];
}

export interface ChangeIssueData {
  oldData?: string;
  newData?: string;
}

export interface IssueFilter {
  pageIndex?: number;
  pageSize?: number;
  type?: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
  assigneeId?: string;
  projectId?: string;
}

export type IssueType = "bug" | "task" | "story" | "epic";
export type IssueStatus = "todo" | "in_progress" | "in_review" | "done";
export type IssuePriority = "highest" | "high" | "medium" | "low" | "lowest";
