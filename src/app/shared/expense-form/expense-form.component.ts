import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { exhaustMap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import * as moment from 'moment'

import { Expense } from 'src/app/model/expense.model';
import { Group } from 'src/app/model/group.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth.service';
import { ExpenseService } from 'src/app/service/expense.service';
import { GroupService } from 'src/app/service/group.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseId: number;
  groupId: number;
  expense: Expense;
  group: Group;
  expenseForm: FormGroup;
  groups: Group[] = [];
  user: User;
  formHeading: string;
  isEdit = true;
  showBackButton = false;
  
  dateTimeFormat = 'YYYY-MM-DD HH:mm';

  private groupsSubscription: Subscription;

  constructor(private groupService: GroupService,
              private authService: AuthService,
              private expenseService: ExpenseService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.authService.user.subscribe(
      (user) => this.user = user
    )
    this.initForm()
    this.route.url.subscribe(
      (url: UrlSegment[]) => {
        if(url[0].path != 'edit') {
          this.isEdit = false;
          this.showBackButton = url[0].path != 'dashboard';
          this.formHeading = "Add Expense";
          this.groupService.fetchGroups();
          this.groupsSubscription = this.groupService.groups.subscribe(
            (groups: Group[]) => {
              this.groups = groups;
            }
          )
        }
        else {
          this.formHeading = "Edit Expense";
          this.route.parent?.params.pipe(
            exhaustMap(params => {
              this.expenseId = +params['expenseId'];
              return this.expenseService.getExpenseById(this.expenseId)
            }),
            exhaustMap(
              (expense: Expense) => {
                this.expense = expense;
                return this.groupService.getGroupById(expense.group_id);
              }
            )
          )
          .subscribe((group: Group) => {
            this.group = group;
            this.groups.push(group);
            this.populateForm()
          })
        }
      }
    )
  }

  initForm(expenseDescription=null, groupId=null, expenseAmount=null, expenseDate=moment().format(this.dateTimeFormat)) {
    this.expenseForm = new FormGroup({
      'description': new FormControl(expenseDescription, [
        Validators.required,
      ]),
      'group_id': new FormControl(groupId, [
        Validators.required
      ]),
      'amount': new FormControl(expenseAmount, [
        Validators.required, this.amountLessThanOneValidator
      ]),
      'expense_date': new FormControl(expenseDate, [
        Validators.required,
        this.dateValidator
      ])
    });
  }

  populateForm() {
    this.initForm(
      this.expense.description, 
      this.group.group_id, this.expense.amount, 
      this.getFormattedDate(this.expense.expense_date)
    );
  }

  onSubmit() {
    let groupId: number = +this.expenseForm.get('group_id').value;
    let expense: Expense = new Expense(
      this.expenseForm.value['description'],
      this.expenseForm.value['amount'],
      this.getFormattedDate(this.expenseForm.value.expense_date),
      this.user.user_id,
      groupId
    );
    if(!this.isEdit) {
      this.expenseService.addExpense(expense).subscribe(
        () => {
          this.expenseService.expensesChanged.next();
          this.groupService.groupsChanged.next();
        }
      );
      this.expenseForm.reset();
      this.router.navigate(['groups']);
    }
    else {
      this.expenseService.updateExpense(this.expenseId, { 
        description: expense.description, expense_date: expense.expense_date, amount: expense.amount 
      })
      .subscribe(
        () => {
          this.expenseService.expensesChanged.next();
          this.groupService.groupsChanged.next();
        }
      )
      this.location.back();
    }
  }

  getFormattedDate(date) {
    return moment(date).format(this.dateTimeFormat);
  }

  isEqual() {
    return this.expense && this.isEdit
        && this.expenseForm.value.description === this.expense.description
        && this.expenseForm.value.amount === this.expense.amount
        && this.getFormattedDate(this.expenseForm.value.expense_date) === this.getFormattedDate(this.expense.expense_date)
        && this.expenseForm.value.group_id === this.expense.group_id;
  }

  isInvalid(formControlName: string) {
    let control = this.expenseForm.get(formControlName);
    return !control.valid && control.touched && control.value == null;
  }

  amountLessThanOneValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value !== null && control.value <= "0") {
      return {'isInvalidAmount': true}
    }
    else return null;
  }

  isAmountInvalid() {
    let control = this.expenseForm.get('amount');
    return control.errors ? control.errors.hasOwnProperty('isInvalidAmount') && control.errors['isInvalidAmount']: false;
  }

  dateValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value != null && new Date(control.value) > new Date()) {
      return {'isInvalidDate': true};
    }
    else return null;
  }

  isDateInvalid() {
    let control = this.expenseForm.get('expense_date');
    return control.errors ? control.errors.hasOwnProperty('isInvalidDate') && control.errors['isInvalidDate'] : false;
  }

  goBack() {
    this.location.back();
  }

  onReset() {
    this.isEdit ? this.populateForm() : this.initForm();
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
  }
}
