import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FirstNameComponent } from '../../L1-items/first-name/first-name.component';
@Component({
  selector: 'app-p-candidate-edit',
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})
export class CandidateEditComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "candidate"
  first_name;
  work_history;
  @ViewChild(FirstNameComponent) firstName : FirstNameComponent;
  constructor() { }

  ngOnInit() {
    console.log(this.userDoc);
    this.first_name = this.userDoc['first_name'];
    this.work_history = this.userDoc['candidate'].work_history;
  }

  getName() {
    // console.log(this.first_name);
  }

  submit(){
    this.firstName.selfValidate();
  }

}
