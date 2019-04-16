import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  first_name;
  firstNameErrorMsg;
  last_name;
  @ViewChild('textInput') textInputRef: ElementRef;
  constructor() { }

  ngOnInit() {
  }
  firstName(name) {
    console.log(name);
    this.first_name = name;
  }
  lastName(name) {
    console.log(name);
    this.last_name = name;
  }
  formSubmit() {
    console.log("form submit");
    //this.textInputRef.nativeElement.selfValidate();
  }

}
