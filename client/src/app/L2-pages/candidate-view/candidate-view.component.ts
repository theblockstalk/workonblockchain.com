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

  //http://localhost:4200/admins/talent/5ced0aa45b3fda10fc2aef2b/view

  routerUrl;
  user_id;
  candidate_image;
  referred_name = '';
  referred_link;
  detail_link;
  candidate_status;
  created_date;
  candidateHistory;

  constructor() {}

  ngOnInit() {
    this.user_id = this.userDoc['_id'];
    this.routerUrl = '/admins/talent/'+ this.user_id +'/edit';
    console.log('in cand view component');
    console.log("this.user_id: " + this.user_id);
    console.log('viewBy: ' + this.viewBy);
    console.log(this.userDoc);
    if(this.userDoc['image']) this.candidate_image = this.userDoc['image'];

    if(this.viewBy === 'admin') {
      if (this.userDoc['user_type'] === 'company') this.detail_link = '/admin-company-detail';
      if (this.userDoc['user_type'] === 'candidate') this.detail_link = '/admin-candidate-detail';

      if (this.userDoc['name']) {
        this.referred_name = this.userDoc['name'];
        this.referred_link = this.userDoc['user_id'];
      }
      else if (this.userDoc['referred_email']) this.referred_name = this.userDoc['referred_email'];

      this.candidateHistory = this.userDoc['candidate'].history;
    }

    if(this.viewBy === 'admin' || this.viewBy === 'candidate') {
      this.candidate_status = this.userDoc['candidate'].latest_status;
      this.created_date = this.userDoc['candidate'].history[this.userDoc['candidate'].history.length - 1].timestamp;
    }
  }

}
