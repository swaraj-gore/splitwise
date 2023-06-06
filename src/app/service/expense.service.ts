import { Injectable, OnDestroy } from "@angular/core";
import { Expense } from "../model/expense.model";
import { BehaviorSubject, Subject} from "rxjs";
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ExpenseService{
    private baseUrl = "http://localhost:3000/expenses";

    expenses = new BehaviorSubject<Expense[]>([]);
    expensesChanged = new Subject<void>();
    
    constructor(private http: HttpClient) {
    }

    getExpenseByGroupId(groupId: number) {
        return this.http
            .get<Expense[]>(`${this.baseUrl}`, {
                params: new HttpParams().set("groupId", groupId)
            }).pipe(
                tap((expenses) => {
                    this.expenses.next(expenses)
                })
            );
    }

    getExpenseById(expenseId: number) {
        return this.http
            .get<Expense>(`${this.baseUrl}/${expenseId}`);
    }

    addExpense(expense: Expense) {
        return this.http.post(`${this.baseUrl}/create`, expense);
    }

    updateExpense(expenseId: number, newExpense: {description: string, expense_date: string, amount: number}) {
        return this.http
            .put(`${this.baseUrl}/${expenseId}`, newExpense);
    }

    deleteExpense(expenseId: number) {
        return this.http
            .delete(`${this.baseUrl}/${expenseId}`);
    }

}