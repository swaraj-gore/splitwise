import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";

export interface UserResponse {
  user_id?: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private baseUrl = "http://localhost:3000/users";

  public user = new BehaviorSubject<UserResponse>(null);

  constructor(private http: HttpClient) {}

  getUser(userId: number) {
    this.http
      .get<UserResponse>(`${this.baseUrl}`, {
        params: new HttpParams().set("userId", userId)
      })
      .subscribe(user => this.user.next(user));
  }
}