import { Component, OnDestroy } from '@angular/core';
import { Group } from '../../../model/group.model';
import { GroupService } from '../../../service/group.service';
import { ActivatedRoute, Params } from '@angular/router';
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

  private expensesSubscription: Subscription;
  constructor(private groupService: GroupService,
              private expenseService: ExpenseService,
              private route: ActivatedRoute) { }
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
          this.expenseService.expensesChanged.subscribe(
            () => this.fetchExpenses()
          )
          this.groupService.groupsChanged.subscribe(
            () => this.fetchGroup()
          )
        }
      )
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

  ngOnDestroy(): void {
    this.expensesSubscription?.unsubscribe();
  }
}
