import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-p-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.css']
})
export class CandidateViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('in cand view component');
  }

}
