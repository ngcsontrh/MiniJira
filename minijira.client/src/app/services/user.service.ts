import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/${id}`);
  }

  addUser(userData: UserData): Observable<UserData> {
    return this.http.post<UserData>(`${this.apiUrl}`, userData);
  }

  updateUser(id: number, userData: UserData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, userData);
  }
}
