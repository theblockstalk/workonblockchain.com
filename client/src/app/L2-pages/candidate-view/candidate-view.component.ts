import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-p-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.css']
})
export class CandidateViewComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "candidate", company
  @Input() anonimize: boolean; //true/false for view by company

  //http://localhost:4200/admins/talent/5cf20e07e205eb2358d33fdb/view

  routerUrl;
  user_id;

  constructor() {}

  ngOnInit() {
    this.user_id = this.userDoc['_id'];
    this.routerUrl = '/admins/talent/'+ this.user_id +'/edit';
    console.log('in cand view component');
    console.log("this.user_id: " + this.user_id);
    console.log('viewBy: ' + this.viewBy);
    console.log(this.userDoc);
  }

}
