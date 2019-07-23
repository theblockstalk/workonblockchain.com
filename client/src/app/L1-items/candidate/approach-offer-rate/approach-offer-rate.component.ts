import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-i-forme-approach-offer-rate',
  templateUrl: './approach-offer-rate.component.html',
  styleUrls: ['./approach-offer-rate.component.css']
})
export class ApproachOfferRateComponent implements OnInit {
  @Input() label: string;
  @Input() minSalary: string;
  @Input() maxSalary: string;

  minSalaryErrorMsg;
  maxSalaryErrorMsg;

  constructor() { }

  ngOnInit() {
  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  convertNumber(string) {
    return Number(string);
  }

  minSalarySelfValidate(){
    if(!this.minSalary){
      this.minSalaryErrorMsg = 'Please enter minimum salary';
      return false;
    }
    if (this.minSalary && !this.checkNumber(this.minSalary)) {
      this.minSalaryErrorMsg = 'Salary should be a number';
      return false;
    }
    delete this.minSalaryErrorMsg;
    return true;
  }

  maxSalarySelfValidate(){
    if (this.maxSalary && !this.checkNumber(this.maxSalary)) {
      this.maxSalaryErrorMsg = 'Salary should be a number';
      return false;
    }
    if(this.maxSalary && this.convertNumber(this.maxSalary) < this.convertNumber(this.minSalary)){
      this.maxSalaryErrorMsg = 'Maximum salary should be greater the minimum salary';
      return false;
    }
    delete this.maxSalaryErrorMsg;
    return true;
  }

}
