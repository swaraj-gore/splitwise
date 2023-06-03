import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";

export interface UserResponse {
  user_id?: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private baseUrl = "http://localhost:3000/users";
  private logOutSubscription: Subscription;

  public user = new BehaviorSubject<UserResponse>(null);

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.logOutSubscription = this.authService.logout$.subscribe(
      () => this.unsubscribe()
    )
  }

  getUser(userId: number) {
    this.http
      .get<UserResponse>(`${this.baseUrl}`, {
        params: new HttpParams().set("userId", userId)
      })
      .subscribe(user => this.user.next(user));
  }

  unsubscribe() {
    this.logOutSubscription.unsubscribe();
    this.user.unsubscribe();
  }
}