import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectData } from '../../models/project-data.model';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  project: ProjectData = {
    id: 0,
    name: '',
    description: '',
    code: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 0,
    creatorName: ''
  };

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProject();
  }

  getProject(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProjectById(id).subscribe(
      (data) => {
        this.project = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateProject(): void {
    this.projectService.updateProject(this.project.id, this.project).subscribe(
      () => {
        console.log('Project updated successfully');
        this.router.navigate(['/projects']);
      },
      (error) => {
        console.error('Error updating project', error);
      }
    );
  }
}
