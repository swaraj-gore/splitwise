import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupsComponent } from './groups/groups.component';
import { HeaderComponent } from './header/header.component';
import { ExpenseComponent } from './groups/expense/expense.component';
import { AddGroupComponent } from './groups/add-group/add-group.component';
import { DashboardComponent } from './groups/dashboard/dashboard.component';
import { GroupSummaryComponent } from './groups/group-summary/group-summary.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { ManageMembersComponent } from './groups/manage-members/manage-members.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    GroupsComponent,
    GroupComponent,
    GroupDetailComponent,
    ExpenseComponent,
    AddGroupComponent,
    DashboardComponent,
    GroupSummaryComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    ManageMembersComponent
  ],
  bootstrap: [AppComponent],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}]
})
export class AppModule {}
