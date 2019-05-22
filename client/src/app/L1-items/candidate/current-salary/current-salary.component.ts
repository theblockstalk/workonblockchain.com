import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../constants/constants';
import { checkNumber } from '../../../../services/object';

@Component({
  selector: 'app-i-forme-current-salary',
  templateUrl: './current-salary.component.html',
  styleUrls: ['./current-salary.component.css']
})
export class CurrentSalaryComponent implements OnInit {
  @Input() current_salary: number;
  @Input() current_currency: string;
  currencies = constants.currencies;
  salaryErrMsg;
  currencyErrMsg;
  constructor() { }

  ngOnInit() {
  }

  selfValidate() {
    if(this.current_salary) {
      if(!checkNumber(this.current_salary)) {
        this.salaryErrMsg = 'Please enter only digits';
        return false;
      }
      if(!this.current_currency) {
        this.currencyErrMsg = 'Please choose currency';
        return false;
      }
    }
    if(this.current_currency) {
      if(!this.current_salary) {
        this.salaryErrMsg = 'Please enter salary';
      }
    }
    delete this.salaryErrMsg;
    delete this.currencyErrMsg;
    return true;
  }

}
