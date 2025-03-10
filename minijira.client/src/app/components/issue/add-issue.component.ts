import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { IssueData } from '../../models/issue-data.model';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent {
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

  constructor(private issueService: IssueService, private router: Router) {}

  addIssue(): void {
    this.issueService.addIssue(this.newIssue).subscribe(
      (data) => {
        this.router.navigate(['/issues']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
