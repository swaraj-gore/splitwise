import { Component } from '@angular/core';
import { Group } from '../group.model';
import { GroupService } from '../group.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Expense } from '../../model/expense.model';
import { ExpenseService } from '../../service/expense.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent {
  group: Group;
  id: number;
  expenses: Expense[] = [];
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
          this.expenseService.expenses.subscribe(
            (expense) => this.expenses = expense
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
}
