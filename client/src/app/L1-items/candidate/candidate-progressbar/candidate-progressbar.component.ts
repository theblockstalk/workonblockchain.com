import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-i-formv-candidate-progressbar',
  templateUrl: './candidate-progressbar.component.html',
  styleUrls: ['./candidate-progressbar.component.css']
})
export class CandidateProgressbarComponent implements OnInit {

  @Input() value: number;
  @Input() class: string; //'success', 'warning', 'info'
  @Input() routerUrl: string;
  @Input() viewBy: string; // admin, candidate or company

  sectionScroll;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  internalRoute(page,dst){
    this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

}
