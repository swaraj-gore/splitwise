import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  addGroupForm: FormGroup;
  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.addGroupForm = new FormGroup({
      'name': new FormControl(null, [
        Validators.required,
      ])
    })
  }

  onSubmit() {
    this.groupService.addGroup(this.addGroupForm.value);
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onClear() {
    this.addGroupForm.reset()
  }

}