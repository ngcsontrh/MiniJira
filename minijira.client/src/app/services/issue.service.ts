import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IssueData } from '../models/issue-data.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'api/issues';

  constructor(private http: HttpClient) {}

  getIssues(projectId: number): Observable<IssueData[]> {
    return this.http.get<IssueData[]>(`${this.apiUrl}?projectId=${projectId}`);
  }

  addIssue(issueData: IssueData): Observable<IssueData> {
    return this.http.post<IssueData>(this.apiUrl, issueData);
  }

  updateIssue(id: number, issueData: IssueData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, issueData);
  }
}
