export interface IssueData {
  id: number;
  projectId: number;
  projectName: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assigneeId: number;
  assigneeName: string;
  reporterId: number;
  reporterName: string;
  createdAt: Date;
  updatedAt: Date;
  frequency: string;
  filePaths: string;
}
