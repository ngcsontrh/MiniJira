import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectData } from '../../models/project-data.model';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  newProject: ProjectData = {
    id: 0,
    name: '',
    description: '',
    code: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 0,
    creatorName: ''
  };

  constructor(private projectService: ProjectService) {}

  addProject(): void {
    this.projectService.addProject(this.newProject).subscribe(
      (data) => {
        console.log('Project added successfully', data);
        this.resetNewProject();
      },
      (error) => {
        console.error('Error adding project', error);
      }
    );
  }

  resetNewProject(): void {
    this.newProject = {
      id: 0,
      name: '',
      description: '',
      code: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: 0,
      creatorName: ''
    };
  }
}
