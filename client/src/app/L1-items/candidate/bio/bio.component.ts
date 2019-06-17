import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {
  @Input() description: string;
  @Input() field_description: string;
  errMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate(){
    if(!this.description) {
      this.errMsg = "Please enter bio description";
      return false;
    }
    else if(this.description.length > 2000) {
      this.errMsg = "Please enter max 2000 characters";
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
