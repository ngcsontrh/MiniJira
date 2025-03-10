import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectData } from '../../models/project-data.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: ProjectData[] = [];
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

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    const memberId = 1; // Replace with actual member ID
    this.projectService.getProjects(memberId).subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addProject(): void {
    this.projectService.addProject(this.newProject).subscribe(
      (data) => {
        this.projects.push(data);
        this.resetNewProject();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateProject(project: ProjectData): void {
    this.projectService.updateProject(project.id, project).subscribe(
      () => {
        const index = this.projects.findIndex((p) => p.id === project.id);
        if (index !== -1) {
          this.projects[index] = project;
        }
      },
      (error) => {
        console.error(error);
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
