import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {constants} from '../../../../constants/constants';
declare var $:any;

@Component({
  selector: 'app-i-forme-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.css']
})
export class WorkHistoryComponent implements OnInit {
  @Input() historyData = [];
  ExperienceForm: FormGroup;
  jobData;
  monthNumber;
  timestamp = Date.now();
  years = constants.year;
  month = constants.calen_month;
  current_work = constants.current_work;
  // currentWorking = [false];
  companyErrMsg;
  positionErrMsg;
  locationErrMsg;
  startMonthErrMsg;
  startYearErrMsg;
  endMonthErrMsg;
  endYearErrMsg;
  experiencearray = [];
  constructor(private _fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });

    if(this.historyData && this.historyData.length > 0) {
      this.jobData = this.historyData;
      this.ExperienceForm = this._fb.group({
        ExpItems: this._fb.array(
          this.history_data()
        )
      });
    }

    console.log("ng on init");
    console.log(this.ExperienceForm.value.ExpItems);
    console.log(this.ExperienceForm.value.ExpItems[0].current_work_value)

  }

  private history_data(): FormGroup[]
  {
    return this.jobData
      .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, description:i.description,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
  }

  monthNumToName(monthnum) {
    return this.month[monthnum-1] || '';
  }

  currentWork(value, index ){
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    // if(value && value.length > 0) {
    //   this.currentWorking[index] = true;
    // }
    // else this.currentWorking[index] = false;
    // console.log(this.currentWorking);
  }

  initExpRows()
  {
    return this._fb.group({
      companyname:[''],
      positionname:[''],
      locationname: [''],
      description: [''] ,
      startdate:[],
      startyear:[],
      end_date:[],
      endyear:[],
      start_date:[],
      enddate:[],
      currentwork:[false],
      // current_work_value:[]
    });
  }

  addNewExpRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    control.push(this.initExpRows());
  }

  deleteExpRow(index: number)
  {
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    control.removeAt(index);
  }

  get DynamicWorkFormControls() {
    return <FormArray>this.ExperienceForm.get('ExpItems');
  }

  monthNameToNum(monthname) {
    this.monthNumber = this.month.indexOf(monthname);
    this.monthNumber = '0'  + (this.monthNumber);
    return this.monthNumber ?  this.monthNumber : 0;
  }
  companyValidate(index) {
    if(!this.ExperienceForm.value.ExpItems[index].companyname) {
      this.companyErrMsg = 'Please fill company';
      return false;
    }
    delete this.companyErrMsg;
    return true;
  }
  positionValidate(index) {
    if(!this.ExperienceForm.value.ExpItems[index].positionname) {
      this.positionErrMsg = 'Please fill position';
      return false;
    }
    delete this.positionErrMsg;
    return true;
  }
  locationValidate(index) {
    if(!this.ExperienceForm.value.ExpItems[index].locationname) {
      this.locationErrMsg = 'Please fill location';
      return false;
    }
    delete this.locationErrMsg;
    return true;
  }
  startMonthValidate(index) {
    if(!this.ExperienceForm.value.ExpItems[index].start_date) {
      this.startMonthErrMsg = 'Please select start date month';
      return false;
    }
    if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[index].start_date , this.ExperienceForm.value.ExpItems[index].startyear)) {
      this.startMonthErrMsg = 'Date must be in the past';
      return false;
    }
    delete this.startMonthErrMsg;
    return true;
  }
  startYearValidate(index) {
    if(!this.ExperienceForm.value.ExpItems[index].startyear) {
      this.startYearErrMsg = 'Please select start date year';
      return false;
    }
    if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[index].start_date , this.ExperienceForm.value.ExpItems[index].startyear)) {
      this.startMonthErrMsg = 'Date must be in the past';
      return false;
    }
    delete this.startYearErrMsg;
    return true;
  }
  endMonthValidate(index) {

    if(!this.ExperienceForm.value.ExpItems[index].end_date) {
      this.endMonthErrMsg = 'Please select end date month';
      return false;
    }
    if(this.compareDates(this.ExperienceForm.value.ExpItems[index].start_date , this.ExperienceForm.value.ExpItems[index].startyear,this.ExperienceForm.value.ExpItems[index].end_date , this.ExperienceForm.value.ExpItems[index].endyear , this.ExperienceForm.value.ExpItems[index].currentwork)) {
      this.startMonthErrMsg = 'Date must be greater than previous date';
      return false;
    }
    if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[index].end_date , this.ExperienceForm.value.ExpItems[index].endyear)) {
      this.endMonthErrMsg = 'Date must be in the past';
      return false;
    }
    delete this.endMonthErrMsg;
    return true;
  }
  endYearValidate(index) {
    if(!this.ExperienceForm.value.ExpItems[index].endyear) {
      this.endYearErrMsg = 'Please select end date year';
      return false;
    }
    if(this.compareDates(this.ExperienceForm.value.ExpItems[index].start_date , this.ExperienceForm.value.ExpItems[index].startyear,this.ExperienceForm.value.ExpItems[index].end_date , this.ExperienceForm.value.ExpItems[index].endyear , this.ExperienceForm.value.ExpItems[index].currentwork)) {
      this.startMonthErrMsg = 'Date must be greater than previous date';
      delete this.endMonthErrMsg;
      delete this.endYearErrMsg;
      return false;
    }
    if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[index].end_date , this.ExperienceForm.value.ExpItems[index].endyear)) {
      this.endMonthErrMsg = 'Date must be in the past';
      delete this.startMonthErrMsg;
      delete this.endYearErrMsg;
      return false;
    }
    delete this.endYearErrMsg;
    return true;
  }

  selfValidate() {
    let errorCount = 0;
    this.experiencearray = [];
    if(this.ExperienceForm.value.ExpItems.length > 0 ) {
      for (let key in this.ExperienceForm.value.ExpItems) {
          const companyValid = this.companyValidate(key);
          if(!companyValid) errorCount++;
          const positionValid = this.positionValidate(key);
          if(!positionValid) errorCount++;
          const locationValid = this.locationValidate(key);
          if(!locationValid) errorCount++;
          const startMonthValid = this.startMonthValidate(key);
          if(!startMonthValid) errorCount++;
          const startYearValid = this.startYearValidate(key);
          if(!startYearValid) errorCount++;
          if(!this.ExperienceForm.value.ExpItems[key].currentwork) {
            const endMonthValid = this.endMonthValidate(key);
            if(!endMonthValid) errorCount++;
            const endYearValid = this.endYearValidate(key);
            if(!endYearValid) errorCount++;
          }

          if(errorCount === 0 ) {
            let today = Date.now();
            let end_date_format;

            const startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
            const endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
            const start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, startmonthIndex);

            if(this.ExperienceForm.value.ExpItems[key].currentwork) {
              end_date_format = today;
            }
            else {
              end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, endmonthIndex);

            }
            const experiencejson = {companyname : this.ExperienceForm.value.ExpItems[key].companyname , positionname : this.ExperienceForm.value.ExpItems[key].positionname,locationname : this.ExperienceForm.value.ExpItems[key].locationname,description : this.ExperienceForm.value.ExpItems[key].description,startdate : start_date_format,enddate : end_date_format , currentwork : this.ExperienceForm.value.ExpItems[key].currentwork};
            this.experiencearray.push(experiencejson);
          }

      }
      if(errorCount === 0) {
        return true;
      }
      else return false;
    }
    return true;

  }

  compareDates(startmonth , startyear , endmonth, endyear, current) {
    let startMonth = this.monthNameToNum(startmonth);
    let startDateFormat  = new Date(startyear, startMonth);

    let endMonth = this.monthNameToNum(endmonth);
    let endDateFormat  = new Date(endyear, endMonth);

    if(current  === true) {
      return false;
    }
    else {
      if(startDateFormat > endDateFormat) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  checkDateVerification(month,year) {
    if(month && year) {
      let startmonthIndex = this.monthNameToNum(month);
      let start_date_format  = new Date(year, startmonthIndex);
      if(start_date_format > new Date() ) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

}
