import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user-data.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  newUser: UserData = {
    id: 0,
    userName: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  constructor(private userService: UserService) {}

  addUser(): void {
    this.userService.addUser(this.newUser).subscribe(
      (data) => {
        console.log('User added successfully:', data);
        this.resetNewUser();
      },
      (error) => {
        console.error('Error adding user:', error);
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
