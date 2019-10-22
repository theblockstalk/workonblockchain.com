import { Component, OnInit,AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe,isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../../data.service";
import {constants} from '../../../constants/constants';
import {unCheckCheckboxes} from "../../../services/object";
declare var $:any;

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit , AfterViewInit
{
  EducationForm: FormGroup;
  ExperienceForm: FormGroup;
  roles=[];yearselected;shown; work_experience_year;
  today = Date.now();
  currentdate;currentyear;currentUser: User;expYear_db=[];expYearRole_db=[];
  value;referringData;expYear=[];expYearRole=[];start_month;start_year;salary;db_lang;
  companyname;positionname;locationname;description;startdate;startyear;enddate;endyear;currentwork;currentenddate;
  currentendyear; uniname;degreename;fieldname;edudate;eduyear; eduData; jobData;datatata=[];exp_data=[];Intro;db_valye=[];
  exp_active_class;active_class;current_currency;
  term_active_class;term_link;
  candidateMsgTitle;
  candidateMsgBody;
  error_msg;
  button_status;
  job_desc_logs;

  inputArray=[];

  constructor(private _fb: FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute, private http: HttpClient,
              private router: Router,private dataservice: DataService,
              private authenticationService: UserService,@Inject(PLATFORM_ID) private platformId: Object) { }


  private education_data(): FormGroup[]
  {
    return this.eduData
      .map(i => this._fb.group({ uniname: i.uniname , degreename : i.degreename,fieldname:i.fieldname,eduyear:i.eduyear} ));
  }

  private history_data(): FormGroup[]
  {
    return this.jobData
      .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, description:i.description,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
  }

  monthNumToName(monthnum) {
    return this.month[monthnum-1] || '';
  }

  ngAfterViewInit(): void
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 300);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 900);
    }
    window.scrollTo(0, 0);

  }

  currentWork(){
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 100);
    }
  }
  message;
  current_work_check=[];

  ngOnInit() {
    this.salary='';
    this.current_currency =-1;
    this.jobData = [];
    this.eduData=[];

    // this.dataservice.currentMessage.subscribe(message => this.message = message);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.shown=true;
    this.currentdate = this.datePipe.transform(this.today, 'MMMM');
    this.currentyear = this.datePipe.transform(this.today, 'yyyy');

    this.EducationForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });

    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    if(this.currentUser && this.currentUser.type == 'candidate') {
      this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
        .subscribe(
          data => {
            if(data['candidate'].terms_id) {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }
            if(data['candidate'].description)
            {

              this.exp_active_class = 'fa fa-check-circle text-success';
            }
            if(data['candidate'].employee || data['candidate'].contractor || data['candidate'].volunteer)
            {
              this.active_class='fa fa-check-circle text-success';

            }
            if(data['candidate'].description) this.Intro = data['candidate'].description;

            if(data['candidate'].work_history || data['candidate'].education_history)
            {
              if(data['candidate'].work_history && data['candidate'].work_history.length>0)
              {
                this.jobData = data['candidate'].work_history;

                for(let data1 of data['candidate'].work_history)
                {
                  this.current_work_check.push(data1.currentwork);

                }


                this.ExperienceForm = this._fb.group({
                  ExpItems: this._fb.array(
                    this.history_data()
                  )
                });
              }
              if(data['candidate'].education_history && data['candidate'].education_history.length>0)
              {

                this.eduData = data['candidate'].education_history;
                this.EducationForm = this._fb.group({
                  itemRows: this._fb.array(
                    this.education_data()
                  )
                });
              }
            }
            this.Intro =data['candidate'].description;
            if(!data['candidate'].why_work && data['candidate'].interest_areas) {
              this.router.navigate(['/resume']);
            }
            else {
              //this.router.navigate(['/resume']);
            }
          },
          error=>
          {
            if(error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error.message === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });

      this.authenticationService.get_page_content('Candidate popup message')
        .subscribe(
          data => {
            if(data)
            {
              this.candidateMsgTitle= data['page_title'];
              this.candidateMsgBody = data['page_content'];
            }
          });
    }
    else
    {
      this.router.navigate(['/not_found']);
    }



  }

  current_work = constants.current_work;
  exp_year = constants.experienceYears;
  year = constants.year;
  month = constants.calen_month;

  onJobSelected(event) {
    this.yearselected= event.target.value;
    //this.position = event.target.value;
  }

  initItemRows() {
    return this._fb.group({
      uniname: [''],
      degreename:[''],
      fieldname:[''],
      eduyear:[]
    });
  }

  initItemRows_db() {
    return this._fb.group({
      uniname: [this.uniname],
      degreename:[this.degreename],
      fieldname:[this.fieldname],
      eduyear:[]
    });
  }

  initExpRows() {
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

  addNewExpRow() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 100);
    }
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    control.push(this.initExpRows());
  }

  deleteExpRow(index: number) {
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    control.removeAt(index);
  }

  get DynamicWorkFormControls() {
    return <FormArray>this.ExperienceForm.get('ExpItems');
  }
  addNewRow() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 100);
    }
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    control.push(this.initItemRows());
  }

  deleteRow(index: number) {
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    control.removeAt(index);
  }

  get DynamicEduFormControls() {
    return <FormArray>this.EducationForm.get('itemRows');
  }

  log;month_number;start_monthh;
  experiencearray=[];
  experiencejson;
  monthNameToNum(monthname) {
    this.start_monthh = this.month.indexOf(monthname);
    this.start_monthh = "0"  + (this.start_monthh);
    return this.start_monthh ?  this.start_monthh : 0;
  }
  startmonthIndex;endmonthIndex;

  current_sal_log;current_currency_log;lang_log;
  exp_lang_log;intro_log;uni_name_log;degree_log;
  field_log;eduYear_log;company_log;position_log;
  location_log;start_date_log;start_year_log;end_date_log;
  exp_count=0;edu_count=0;
  start_date_year_log;
  end_date_year_log;
  experience_submit(searchForm: NgForm) {
    this.error_msg="";
    this.edu_count=0;
    this.exp_count =0;
    this.button_status = 'submit';
    this.dateValidation= '';

    if(!this.Intro)
    {

      this.intro_log="Please fill 2-5 sentence bio"
    }


    if(this.EducationForm.value.itemRows.length >= 1)
    {
      for (var key in this.EducationForm.value.itemRows)
      {
        if(!this.EducationForm.value.itemRows[key].uniname)
        {
          this.uni_name_log = "Please fill university";
        }

        if(!this.EducationForm.value.itemRows[key].degreename)
        {
          this.degree_log = "Please fill degree";
        }

        if(!this.EducationForm.value.itemRows[key].fieldname)
        {
          this.field_log = "Please fill field of study";
        }

        if(!this.EducationForm.value.itemRows[key].eduyear)
        {
          this.eduYear_log = "Please fill graduation year";
        }

        if(this.EducationForm.value.itemRows[key].uniname && this.EducationForm.value.itemRows[key].degreename &&
          this.EducationForm.value.itemRows[key].fieldname && this.EducationForm.value.itemRows[key].eduyear)
        {

          this.edu_count = this.edu_count + 1;
        }

      }

    }
    if(this.ExperienceForm.value.ExpItems.length >=1)
    {

      for (var key in this.ExperienceForm.value.ExpItems)
      {
        this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
        this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
        this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
        if(this.ExperienceForm.value.ExpItems[key].currentwork === true)
        {
          this.end_date_format = this.today;
        }
        else
        {
          this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);

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
          this.submit = 'click';
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
          if(this.ExperienceForm.value.ExpItems[key].description && this.ExperienceForm.value.ExpItems[key].description.length < 40){
            verified=1;
            this.job_desc_logs = 'Please enter minimum 40 characters description';
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

    if(this.Intro && this.edu_count === this.EducationForm.value.itemRows.length && this.exp_count === this.ExperienceForm.value.ExpItems.length) {
      this.verify = true;
    }

    else {
      this.verify = false;
    }

    if(this.verify === true )
    {
      this.submit_info(searchForm);

    }

    else
    {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }



  }

  start_date_format;
  end_date_format;
  educationjson; education_json_array=[];
  dateValidation;
  count;
  submit;
  submit_info(searchForm )
  {
    this.experiencearray=[];
    this.education_json_array=[];
    this.log='';
    this.count = 0;
    this.dateValidation = '';
    this.submit = "click";

    if(this.ExperienceForm.value.ExpItems)
    {
      for (var key in this.ExperienceForm.value.ExpItems)
      {
        this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
        this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
        this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
        if(this.ExperienceForm.value.ExpItems[key].currentwork == true)
        {
          this.end_date_format = this.today;
        }
        else
        {
          this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);

        }
        this.experiencejson = {companyname : this.ExperienceForm.value.ExpItems[key].companyname , positionname : this.ExperienceForm.value.ExpItems[key].positionname,locationname : this.ExperienceForm.value.ExpItems[key].locationname,description : this.ExperienceForm.value.ExpItems[key].description,startdate : this.start_date_format,enddate : this.end_date_format , currentwork : this.ExperienceForm.value.ExpItems[key].currentwork};
        this.experiencearray.push(this.experiencejson);
      }

    }

    if(this.EducationForm.value.itemRows)
    {
      for ( var key in this.EducationForm.value.itemRows)
      {
        this.EducationForm.value.itemRows[key].eduyear =  parseInt(this.EducationForm.value.itemRows[key].eduyear);
        this.educationjson = {uniname : this.EducationForm.value.itemRows[key].uniname , degreename :  this.EducationForm.value.itemRows[key].degreename
          ,fieldname : this.EducationForm.value.itemRows[key].fieldname , eduyear : this.EducationForm.value.itemRows[key].eduyear  };
        this.education_json_array.push(this.educationjson) ;
      }
    }

    let inputQuery : any = {};
    let candidateQuery:any ={};

    if(this.education_json_array && this.education_json_array.length>0) candidateQuery.education_history =  this.education_json_array;
    else inputQuery.unset_education_history = true;

    if(this.experiencearray && this.experiencearray.length>0) candidateQuery.work_history =  this.experiencearray;
    else inputQuery.unset_work_history = true;

    if(this.Intro) candidateQuery.description =  this.Intro;

    inputQuery.candidate = candidateQuery;
    inputQuery.wizardNum = 5;
      this.authenticationService.edit_candidate_profile(this.currentUser._id, inputQuery, false)
        .subscribe(
          data => {
            if(data)
            {
              if (isPlatformBrowser(this.platformId)) {
                $("#popModal").modal({
                  backdrop: 'static',
                  keyboard: true,
                  show: true
                });
              }

              //this.router.navigate(['/candidate_profile']);
            }



          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });

  }

  redirectToCandidate()
  {
    if (isPlatformBrowser(this.platformId)) $('#popModal').modal('hide');
    this.router.navigate(['/users/talent']);
  }

  work_start_data(e)
  {
    this.start_month = e.target.value ;
  }
  work_start_year(e)
  {
    this.start_year= e.target.value;
  }
  verify;
  checkDateVerification(month,year) {
    if(month && year) {
      this.startmonthIndex = this.monthNameToNum(month);
      this.start_date_format  = new Date(year, this.startmonthIndex);
      if(this.start_date_format > new Date() ) {
        this.verify= false;
        return true;
      }
      else {
        this.verify= true;
        return false;
      }
    }
    else {
      return false;
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
      if(startDateFormat > endDateFormat && this.submit === 'click') {
        this.dateValidation = 'Date must be greater than previous date';
        this.verify = false;
        return true;
      }
      else {
        this.verify = true;
        return false;
      }
    }
  }

  endDateYear() {
    this.dateValidation= '';
  }
}
