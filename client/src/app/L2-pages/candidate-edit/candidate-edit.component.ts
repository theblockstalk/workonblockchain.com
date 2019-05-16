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
  constructor() { }

  ngOnInit() {
    console.log(this.userDoc);
    this.first_name = this.userDoc['first_name'];
  }

  getName() {
    console.log(this.first_name);
  }
}
