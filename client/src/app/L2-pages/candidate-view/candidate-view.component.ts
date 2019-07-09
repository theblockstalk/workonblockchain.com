import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-p-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.css']
})
export class CandidateViewComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "candidate", company

  constructor() { }

  ngOnInit() {
    console.log('in cand view component');
  }

}
