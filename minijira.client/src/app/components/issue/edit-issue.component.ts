import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { IssueData } from '../../models/issue-data.model';

@Component({
  selector: 'app-edit-issue',
  templateUrl: './edit-issue.component.html',
  styleUrls: ['./edit-issue.component.css']
})
export class EditIssueComponent implements OnInit {
  issue: IssueData = {
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

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIssue();
  }

  getIssue(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.issueService.getIssueById(id).subscribe(
      (data) => {
        this.issue = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateIssue(): void {
    this.issueService.updateIssue(this.issue.id, this.issue).subscribe(
      () => {
        this.router.navigate(['/issues']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
