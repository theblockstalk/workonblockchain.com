import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-u-users-companies-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('in CandidateDetailsComponent');
  }

}
