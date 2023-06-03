import { Injectable, OnDestroy } from "@angular/core";
import { Expense } from "../model/expense.model";
import { BehaviorSubject} from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ExpenseService{
    private baseUrl = "http://localhost:3000/expenses";

    expenses = new BehaviorSubject<Expense[]>([]);
    
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

    addExpense(expense: Expense) {
        return this.http.post(`${this.baseUrl}/create`, expense);
    }

}