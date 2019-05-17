import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {constants} from '../../../constants/constants';
declare var $:any;
import {TextInputComponent} from '../../L0-components/forms-edit/text-input/text-input.component';

@Component({
  selector: 'app-i-forme-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.css']
})
export class WorkHistoryComponent implements OnInit {
  @Input() historyData: object;
  ExperienceForm: FormGroup;
  jobData;
  monthNumber;
  timestamp = Date.now();
  company_log;
  position_log;
  location_log;
  start_date_log;
  start_date_year_log;
  end_date_log;
  end_date_year_log;
  dateValidation;
  exp_count;
  years = constants.year;
  month = constants.calen_month;
  @ViewChild(TextInputComponent ) textInput: TextInputComponent;

  constructor(private _fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    // console.log(this.historyData);
    this.jobData = this.historyData;
    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });
    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array(
        this.history_data()
      )
    });
    // console.log(this.ExperienceForm.value);
  }

  private history_data(): FormGroup[]
  {
    return this.jobData
      .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, description:i.description,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
  }

  monthNumToName(monthnum) {
    console.log(this.month[monthnum-1]);
    return this.month[monthnum-1] || '';
  }

  currentWork(){
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
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

    });
  }

  addNewExpRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
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
    this.monthNumber = "0"  + (this.monthNumber);
    return this.monthNumber ?  this.monthNumber : 0;
  }
  selfValidate() {
    if(this.ExperienceForm.value.ExpItems.length >=1)
    {

      for (var key in this.ExperienceForm.value.ExpItems)
      {

        if(!this.ExperienceForm.value.ExpItems[key].companyname)
        {
          this.company_log = "Please fill company";
        }

        if(!this.ExperienceForm.value.ExpItems[key].positionname)
        {
          this.position_log = "Please fill position";
        }

        }
      }
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
        this.dateValidation = 'Date must be greater than previous date';
        // this.verify = false;
        return true;
      }
      else {
        // this.verify = true;
        return false;
      }
    }
  }

  checkDateVerification(month,year) {
    if(month && year) {
      let startmonthIndex = this.monthNameToNum(month);
      let start_date_format  = new Date(year, startmonthIndex);
      if(start_date_format > new Date() ) {
        // this.verify= false;
        return true;
      }
      else {
        // this.verify= true;
        return false;
      }
    }
    else {
      return false;
    }
  }

}
