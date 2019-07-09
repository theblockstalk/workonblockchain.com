import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.css']
})
export class RightSideBarComponent implements OnInit {
  @Input() referredName: string;
  @Input() referredLink: string;
  @Input() detailLink: string;
  @Input() nationality: Array<string>;
  @Input() contactNumber: string;
  @Input() baseCity: string;
  @Input() candidateStatus: object;
  @Input() createdDate: string;
  @Input() viewBy: string; // admin, candidate or company

  constructor() { }

  ngOnInit() {
  }

}
