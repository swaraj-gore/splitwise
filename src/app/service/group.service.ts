import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Group } from '../groups/group.model';
import { Expense } from '../model/expense.model';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class GroupService {
  public groupsChanged = new Subject<Group[]>();
  public groupChanged = new Subject<Group>();
  private groups: Group[] = [];
  private group: Group;

  constructor(private dataService: DataService) {}

  getGroups(): Group[] {
    this.fetchGroups();
    return this.groups.slice();
  }

  fetchGroups() {
    this.dataService.getGroups().subscribe((groups: Group[]) => {
      this.groups = groups;
      this.groupsChanged.next(groups);
    });
  }

  getGroup(groupId: number) {
    this.dataService.getGroup(groupId).subscribe((group: Group) => {
      this.group = group;
      this.groupChanged.next(group);
    });
    return this.group;
  }

  addExpense(expense: Expense) {
    this.dataService.addExpense(expense).subscribe((response) => {
      this.fetchGroups();
    });
  }

  // updateGroup(id: number, group: Group) {
  //   this.groups[id] = group;
  //   this.groupsChanged.next(this.groups.slice())
  // }

  addGroup(group) {
    this.dataService.addGroup(group).subscribe((repsponse) => {
      this.fetchGroups();
    });
  }

  getCurrentUser(): number {
    return 0;
  }

  getGroupSummary(groupId: number) {
    return this.dataService.getGroupSummary(groupId);
  }

  getLentSummary(groupId: number) {
    return this.dataService.getLentSummary(groupId);
  }
}
