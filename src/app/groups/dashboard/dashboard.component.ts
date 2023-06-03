import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Expense } from '../../model/expense.model';
import { Group } from '../group.model';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user.model';
import { AuthService } from '../../auth/auth.service';
import { ExpenseService } from 'src/app/service/expense.service';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService]
})
export class DashboardComponent {
  addExpenseForm: FormGroup;
  groups: Group[] = [];
  user: User;
  constructor(private groupService: GroupService,
              private authService: AuthService,
              private expenseService: ExpenseService,
              private router: Router) { }

  ngOnInit() {
    this.addExpenseForm = new FormGroup({
      'expenseDescription': new FormControl(null, [
        Validators.required,
      ]),
      'groupId': new FormControl(0, [
        Validators.required,
      ]),
      'expenseAmount': new FormControl(null, [
        Validators.required, this.amountLessThanOneValidator
      ]),
      'expenseDate': new FormControl(new Date(), [
        Validators.required,
        this.dateValidator
      ])
    });

    this.groupService.fetchGroups();
    this.groupService.groups.subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      }
    )

    this.authService.user.subscribe(
      (user) => this.user = user
    )
  }

  onAddExpense() {
    let groupId: number = +this.addExpenseForm.get('groupId').value;
    let expense: Expense = new Expense(
      this.addExpenseForm.value['expenseDescription'],
      this.addExpenseForm.value['expenseAmount'],
      this.addExpenseForm.value['expenseDate'].toISOString().slice(0, 19).replace('T', ' '),
      this.user.user_id,
      groupId
    );
    this.expenseService.addExpense(expense);
    this.addExpenseForm.reset()
    this.router.navigate(['groups'])
  }

  isInvalid(formControlName: string) {
    let control = this.addExpenseForm.get(formControlName);
    return !control.valid && control.touched && control.value == null;
  }

  amountLessThanOneValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value !== null && control.value <= "0") {
      return {'isInvalidAmount': true}
    }
    else return null;
  }

  isAmountInvalid() {
    let control = this.addExpenseForm.get('expenseAmount');
    return control.errors ? control.errors.hasOwnProperty('isInvalidAmount') && control.errors['isInvalidAmount']: false;
  }

  dateValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value != null && new Date(control.value) > new Date()) {
      return {'isInvalidDate': true};
    }
    else return null;
  }

  isDateInvalid() {
    let control = this.addExpenseForm.get('expenseDate');
    return control.errors ? control.errors.hasOwnProperty('isInvalidDate') && control.errors['isInvalidDate'] : false;
  }

  onReset() {
    this.addExpenseForm.reset()
  }

}
