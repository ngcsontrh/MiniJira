import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectData } from '../models/project-data.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'api/projects';

  constructor(private http: HttpClient) {}

  getProjects(memberId: number): Observable<ProjectData[]> {
    return this.http.get<ProjectData[]>(`${this.apiUrl}?memberId=${memberId}`);
  }

  addProject(projectData: ProjectData): Observable<ProjectData> {
    return this.http.post<ProjectData>(this.apiUrl, projectData);
  }

  updateProject(id: number, projectData: ProjectData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, projectData);
  }
}
