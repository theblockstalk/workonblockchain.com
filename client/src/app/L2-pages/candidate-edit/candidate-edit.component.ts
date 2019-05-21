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
  email_address;
  @ViewChild(FirstNameComponent) firstName : FirstNameComponent;
  constructor() { }

  ngOnInit() {
    console.log(this.userDoc);
    this.first_name = this.userDoc['first_name'];
    this.work_history = this.userDoc['candidate'].work_history;
    this.email_address = this.userDoc['email_address'];
  }

  submit(){
    console.log("submit")
    if(!this.firstName.selfValidate()){
      console.log("ifffff");
      this.first_name = this.firstName.first_name;
    }
    console.log(this.first_name);
  }

}
