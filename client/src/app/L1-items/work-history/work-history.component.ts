import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {constants} from '../../../constants/constants';
declare var $:any;

@Component({
  selector: 'app-work-history',
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
  constructor(private _fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    console.log(this.historyData);
    this.jobData = this.historyData;
    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });
    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array(
        this.history_data()
      )
    });
    console.log(this.ExperienceForm.value);
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
        let end_date_format;
        let startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
        let endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
        let start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, startmonthIndex);
        if(this.ExperienceForm.value.ExpItems[key].currentwork === true)
        {
          end_date_format = this.timestamp;
        }
        else
        {
          end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, endmonthIndex);

        }

        if(!this.ExperienceForm.value.ExpItems[key].companyname)
        {
          this.company_log = "Please fill company";
        }

        if(!this.ExperienceForm.value.ExpItems[key].positionname)
        {
          this.position_log = "Please fill position";
        }


        if(!this.ExperienceForm.value.ExpItems[key].locationname)
        {
          this.location_log = "Please fill location";

        }

        if(!this.ExperienceForm.value.ExpItems[key].startdate )
        {
          this.start_date_log = "Please fill start date month";
        }

        if( !this.ExperienceForm.value.ExpItems[key].startyear)
        {
          this.start_date_year_log = "Please fill start date year";
        }

        if(!this.ExperienceForm.value.ExpItems[key].end_date && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_log = "Please fill end date month";
        }

        if(!this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_year_log = "Please fill end date year ";
        }

        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname !== "" &&this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].locationname !== "" && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear &&
          this.ExperienceForm.value.ExpItems[key].end_date && this.ExperienceForm.value.ExpItems[key].endyear &&
          this.ExperienceForm.value.ExpItems[key].currentwork==false)
        {
          let verified=0;
          if(this.compareDates(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear,this.ExperienceForm.value.ExpItems[key].end_date , this.ExperienceForm.value.ExpItems[key].endyear , this.ExperienceForm.value.ExpItems[key].currentwork)) {
            this.dateValidation = 'Date must be greater than previous date';
            verified=1;
          }
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].end_date , this.ExperienceForm.value.ExpItems[key].endyear)) {
            verified=1;
          }
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            verified=1;
          }
          if(verified === 0) {
            this.exp_count = this.exp_count + 1;
          }


        }


        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname && this.ExperienceForm.value.ExpItems[key].positionname !== "" &&
          this.ExperienceForm.value.ExpItems[key].locationname &&this.ExperienceForm.value.ExpItems[key].locationname !== "" && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear &&  this.ExperienceForm.value.ExpItems[key].currentwork==true
        )
        {
          let dverified=0;
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            dverified=1;
          }
          if(dverified === 0) {
            this.exp_count = this.exp_count + 1;
          }


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
