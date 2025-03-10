import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user-data.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: UserData = {
    id: 0,
    userName: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(id).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  updateUser(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      () => {
        console.log('User updated successfully');
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
}
