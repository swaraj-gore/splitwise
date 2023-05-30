import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from './group.model';
import { GroupService } from './group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  public groups: Group[] = []
  constructor(private groupService: GroupService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.groupService.groups.subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      }
    )
  }

  onAddGroup() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

}