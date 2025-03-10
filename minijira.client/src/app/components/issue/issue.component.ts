import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../services/issue.service';
import { IssueData } from '../../models/issue-data.model';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
  issues: IssueData[] = [];
  newIssue: IssueData = {
    id: 0,
    projectId: 0,
    projectName: '',
    title: '',
    description: '',
    priority: '',
    status: '',
    assigneeId: 0,
    assigneeName: '',
    reporterId: 0,
    reporterName: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    frequency: '',
    filePaths: ''
  };

  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    this.getIssues();
  }

  getIssues(): void {
    const projectId = 1; // Replace with actual project ID
    this.issueService.getIssues(projectId).subscribe(
      (data) => {
        this.issues = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addIssue(): void {
    this.issueService.addIssue(this.newIssue).subscribe(
      (data) => {
        this.issues.push(data);
        this.resetNewIssue();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateIssue(issue: IssueData): void {
    this.issueService.updateIssue(issue.id, issue).subscribe(
      () => {
        const index = this.issues.findIndex((i) => i.id === issue.id);
        if (index !== -1) {
          this.issues[index] = issue;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  resetNewIssue(): void {
    this.newIssue = {
      id: 0,
      projectId: 0,
      projectName: '',
      title: '',
      description: '',
      priority: '',
      status: '',
      assigneeId: 0,
      assigneeName: '',
      reporterId: 0,
      reporterName: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      frequency: '',
      filePaths: ''
    };
  }
}
