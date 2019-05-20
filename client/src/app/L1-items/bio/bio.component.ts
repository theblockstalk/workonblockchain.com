import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {
  @Input() description: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.description) {
      this.errMsg = "Please enter bio description";
      return true;
    }
    delete this.errMsg;
    return false;
  }

}
