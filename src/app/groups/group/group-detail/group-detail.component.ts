import { Component, OnDestroy } from '@angular/core';

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Group } from '../../../model/group.model';
import { GroupService } from '../../../service/group.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Expense } from '../../../model/expense.model';
import { ExpenseService } from '../../../service/expense.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnDestroy{
  group: Group;
  id: number;
  expenses: Expense[] = [];

  faEdit = faEdit
  faDelete = faTrash

  private expensesSubscription: Subscription;
  private expensesChangedSubscription: Subscription;
  private groupsChangedSubscription: Subscription;

  constructor(private groupService: GroupService,
              private expenseService: ExpenseService,
              private route: ActivatedRoute,
              private router: Router) { }
  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id']
          this.fetchGroup();
          this.fetchExpenses();
          this.expensesSubscription = this.expenseService.expenses.subscribe(
            (expense) => this.expenses = expense
          )
          this.expensesChangedSubscription = this.expenseService.expensesChanged.subscribe(
            () => this.fetchExpenses()
          )
          this.groupsChangedSubscription = this.groupService.groupsChanged.subscribe(
            () => this.fetchGroup()
          )
        }
      )
  }

  onEditGroup() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  fetchGroup() {
    this.groupService.getGroupById(this.id)
      .subscribe(group => {
        this.group = group;
      });
  }

  fetchExpenses() {
    this.expenseService.getExpenseByGroupId(this.id).subscribe(
      (expenses) => this.expenses = expenses 
    );
  }

  onDeleteGroup() {
    this.groupService.deleteGroup(this.group.group_id).subscribe(
      () => {
        this.groupService.fetchGroups() // Fetch groups instead of emitting an event to avoid 404 for fetching summaries
      }
    );
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.expensesSubscription?.unsubscribe();
    this.expensesChangedSubscription.unsubscribe();
    this.groupsChangedSubscription.unsubscribe();
  }
}
