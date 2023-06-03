import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Expense } from '../../../../model/expense.model';
import { UserResponse, UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [UserService]
})
export class ExpenseComponent implements OnInit{

  @Input() expense: Expense;
  user: UserResponse;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser(this.expense.user_id);
    this.userService.user.subscribe(user => this.user = user)
  }
}
