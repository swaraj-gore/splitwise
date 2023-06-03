import { Injectable } from "@angular/core";
import { Expense } from "../model/expense.model";
import { BehaviorSubject, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GroupService } from "./group.service";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class ExpenseService {
    private baseUrl = "http://localhost:3000/expenses";
    private logOutSubscription: Subscription;

    expenses = new BehaviorSubject<Expense[]>([]);
    
    constructor(private http: HttpClient,
                private groupService: GroupService,
                private authService: AuthService) {
        this.logOutSubscription = this.authService.logout$.subscribe(
            () => this.unsubscribe()
        )
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
        return this.http.post(`${this.baseUrl}/create`, expense).subscribe(
            (response) => this.groupService.fetchGroups()
        );
    }

    unsubscribe() {
        this.logOutSubscription.unsubscribe();
        this.expenses.unsubscribe();
    }


}