import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Expense } from 'src/app/model/expense.model';
import { ExpenseService } from 'src/app/service/expense.service';
import { UserResponse, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css'],
  providers: [UserService]
})
export class ExpenseDetailComponent implements OnInit, OnDestroy {
  expenseId: number;
  expense: Expense;
  user: UserResponse;
  private userSubscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private expenseService: ExpenseService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.expenseId = +params['expenseId'];
        this.expenseService.getExpenseById(this.expenseId).subscribe(
          (expense: Expense) => {
            this.expense = expense;
            this.userService.getUser(this.expense.user_id);
            this.userSubscription = this.userService.user.subscribe(user => this.user = user)
          }
        );
      }
    )
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
