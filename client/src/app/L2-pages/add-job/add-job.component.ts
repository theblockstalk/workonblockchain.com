import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-p-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "company"

  constructor() { }

  ngOnInit() {
    console.log('add job page');
    console.log(this.userDoc);
  }

}
