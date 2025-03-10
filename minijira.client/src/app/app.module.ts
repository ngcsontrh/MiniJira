import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IssueService } from './services/issue.service';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';
import { AddIssueComponent } from './components/issue/add-issue.component';
import { EditIssueComponent } from './components/issue/edit-issue.component';
import { AddProjectComponent } from './components/project/add-project.component';
import { EditProjectComponent } from './components/project/edit-project.component';
import { AddUserComponent } from './components/user/add-user.component';
import { EditUserComponent } from './components/user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    AddIssueComponent,
    EditIssueComponent,
    AddProjectComponent,
    EditProjectComponent,
    AddUserComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    IssueService,
    ProjectService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
