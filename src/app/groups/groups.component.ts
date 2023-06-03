import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../model/group.model';
import { GroupService } from '../service/group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {
  public groups: Group[] = []

  private groupsSubscription: Subscription;

  constructor(private groupService: GroupService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.groupsSubscription = this.groupService.groups.subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      }
    )
  }

  onAddGroup() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy(): void {
    this.groupsSubscription?.unsubscribe();
  }

}