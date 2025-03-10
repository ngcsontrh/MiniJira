import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueComponent } from './components/issue/issue.component';
import { ProjectComponent } from './components/project/project.component';
import { UserComponent } from './components/user/user.component';
import { AddIssueComponent } from './components/issue/add-issue.component';
import { EditIssueComponent } from './components/issue/edit-issue.component';
import { AddProjectComponent } from './components/project/add-project.component';
import { EditProjectComponent } from './components/project/edit-project.component';
import { AddUserComponent } from './components/user/add-user.component';
import { EditUserComponent } from './components/user/edit-user.component';

const routes: Routes = [
  { path: 'issues', component: IssueComponent },
  { path: 'projects', component: ProjectComponent },
  { path: 'users', component: UserComponent },
  { path: 'add-issue', component: AddIssueComponent },
  { path: 'edit-issue/:id', component: EditIssueComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'edit-project/:id', component: EditProjectComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
