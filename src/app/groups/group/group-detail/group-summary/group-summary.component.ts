import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GroupService } from '../../../../service/group.service';

@Component({
  selector: 'app-group-summary',
  templateUrl: './group-summary.component.html',
  styleUrls: ['./group-summary.component.css']
})
export class GroupSummaryComponent implements OnInit {

  groupId: number;
  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private router: Router) { }

  groupSummary: any = null;
  lentSummary : any = null;

  ngOnInit() {
    this.route.parent?.params.subscribe(
      (params: Params) => {
        this.groupId = +params['id'];
        this.groupService.getGroupSummary(this.groupId).subscribe(
          (groupSummary) => {
            this.groupSummary = groupSummary;
          }
        )
        this.groupService.getLentSummary(this.groupId).subscribe(
          (lentSummary) => {
            this.lentSummary = lentSummary;
          }
        )
        this.groupService.groupsChanged.subscribe(
          () => {
            this.groupService.getGroupSummary(this.groupId).subscribe(
              (groupSummary) => {
                this.groupSummary = groupSummary;
              }
            )
            this.groupService.getLentSummary(this.groupId).subscribe(
              (lentSummary) => {
                this.lentSummary = lentSummary;
              }
            )
          }
        )
      }
    )
  }

  getSummaryText(settlementStatus: string) {
    let summaryText: string = '';
    switch(settlementStatus) {
      case 'OWES':
        summaryText = 'owes'
        break;
      case 'GETS_BACK':
        summaryText = 'gets back'
        break;
      case 'SETTLED_UP':
        summaryText = 'settled up'
        break;
    }
    return summaryText;
  }

  onManageMember() {
    this.router.navigate(['../manage-members'], {relativeTo: this.route})
  }

}