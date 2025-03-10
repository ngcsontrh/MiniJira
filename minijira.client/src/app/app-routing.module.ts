import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueComponent } from './components/issue/issue.component';
import { ProjectComponent } from './components/project/project.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: 'issues', component: IssueComponent },
  { path: 'projects', component: ProjectComponent },
  { path: 'users', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
