import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user-data.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: UserData[] = [];
  newUser: UserData = {
    id: 0,
    userName: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addUser(): void {
    this.userService.addUser(this.newUser).subscribe(
      (data) => {
        this.users.push(data);
        this.resetNewUser();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateUser(user: UserData): void {
    this.userService.updateUser(user.id, user).subscribe(
      () => {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  resetNewUser(): void {
    this.newUser = {
      id: 0,
      userName: '',
      fullName: '',
      email: '',
      phoneNumber: ''
    };
  }
}
