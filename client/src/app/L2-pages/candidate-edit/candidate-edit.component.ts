import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-candidate-edit',
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})
export class CandidateEditComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string;
  first_name;
  work_history;
  constructor() { }

  ngOnInit() {
    console.log(this.userDoc);
    console.log(this.userDoc['candidate'].work_history);
    this.first_name = this.userDoc['first_name'];
    this.work_history = this.userDoc['candidate'].work_history;
  }

  getName() {
    console.log(this.first_name);
  }
}
