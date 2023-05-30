import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Group } from "./group.model";
import { UserResponse } from "../service/user.service";

@Injectable({providedIn: "root"})
export class GroupService {
  groups = new BehaviorSubject<Group[]>([]);

  private baseUrl: string = 'http://localhost:3000/groups'

  constructor(private http: HttpClient) {
    this.fetchGroups();
  }

  fetchGroups() {
    this.http
      .get<Group[]>(`${this.baseUrl}`)
      .subscribe(groups => this.groups.next(groups));
  }

  getGroupById(groupId: number) {
    return this.http.get<Group>(`${this.baseUrl}/${groupId}`).pipe(
      map(
        (userRespone => userRespone[0])
      )
    );
  }

  getNonMebers(groupId: number) {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/${groupId}/nonmembers`);
  }

  getMembers(groupId: number) {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/${groupId}/members`);
  }

  getGroupSummary(groupId: number) {
    return this.http.get(`${this.baseUrl}/${groupId}/summary`);
  }

  getLentSummary(groupId: number) {
    return this.http.get(`${this.baseUrl}/${groupId}/lent`);
  }

  addGroup(group: { name: string }) {
    return this.http.post(`${this.baseUrl}/create`, group).subscribe(
      () => {
        this.fetchGroups();
      }
    );
  }

  addMembers(groupId: number, memberIds: number[]) {
    return this.http.post(`${this.baseUrl}/${groupId}/members`, { memberIds })
    .pipe(
      tap(
        () => this.fetchGroups()
      )
    )
  }

  deleteMember(groupId: number, memberId: number) {
    return this.http.delete(`${this.baseUrl}/${groupId}/members/${memberId}`)
    .pipe(
      tap(
        () => this.fetchGroups()
      )
    )
  }
}