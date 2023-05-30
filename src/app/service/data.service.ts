import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

import { Expense } from '../model/expense.model';
import { Group } from '../groups/group.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getGroups() {
    return this.http.get<Group[]>(`${this.baseUrl}/groups`).pipe(
      map((responseData) => {
        let groups: Group[] = [];
        responseData.forEach((group) => {
          if (group.total_expense === null) group.total_expense = 0;
          groups.push(group);
        });
        return groups;
      })
    );
  }

  getGroup(groupId: number) {
    return this.http.get<Group>(`${this.baseUrl}/groups/${groupId}`).pipe(
      map((group) => {
        if (group.total_expense === null) group.total_expense = 0;
        return group;
      })
    );
  }
  getExpensesByGroupId(groupId: number) {
    return this.http.get<Expense[]>(`${this.baseUrl}/expenses/group/${groupId}`);
  }

  getUserById(userId: number) {
    return this.http.get<User[]>(`${this.baseUrl}/users/${userId}`).pipe(
      map((users) => {
        return users[0];
      })
    );
  }

  addGroup(group: { name: string }) {
    return this.http.post(`${this.baseUrl}/groups`, group);
  }

  addExpense(expense: Expense) {
    return this.http.post(`${this.baseUrl}/expenses/create`, expense);
  }

  getGroupSummary(groupId: number) {
    return this.http.get(`${this.baseUrl}/groups/${groupId}/summary`);
  }

  getLentSummary(groupId: number) {
    return this.http.get(`${this.baseUrl}/groups/${groupId}/lent`);
  }
}
