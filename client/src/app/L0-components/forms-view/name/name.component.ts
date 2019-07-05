import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']
})
export class NameComponent implements OnInit {
  @Input() firstName: string; //First name of candidate
  @Input() lastName: string; //Last name of candidate

  constructor() { }

  ngOnInit() {
  }

}
