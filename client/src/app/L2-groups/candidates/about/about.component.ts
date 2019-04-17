import { Component, OnInit, ViewChild  } from '@angular/core';
import { TextInputComponent } from '../../../L0-components/forms-edit/text-input/text-input.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  first_name;
  last_name;
  @ViewChild(TextInputComponent ) textInput: TextInputComponent ;
  constructor() { }

  ngOnInit() {
  }

  formSubmit() {
    console.log("form submit");
    console.log(this.textInput.textValue);
    console.log(this.last_name);
    this.textInput.selfValidate();
  }

}
