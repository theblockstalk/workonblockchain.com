import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() content: string;
  errMsg;

  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.content) {
      this.errMsg = "Please enter page content";
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
