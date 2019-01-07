import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../../data.service";
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
  language=[]; roles=[];yearselected;shown; work_experience_year;
  today = Date.now();
  currentdate;currentyear;currentUser: User;language_checked;language_exp=[];expYear_db=[];expYearRole_db=[];
  value;referringData;expYear=[];expYearRole=[];start_month;start_year;salary;db_lang;
  companyname;positionname;locationname;description;startdate;startyear;enddate;endyear;currentwork;currentenddate;currentendyear; uniname;degreename;fieldname;edudate;eduyear; eduData; jobData;datatata=[];exp_data=[];Intro;db_valye=[];
  exp_active_class;active_class;current_currency;
  term_active_class;term_link;
  candidateMsgTitle;
  candidateMsgBody;
  error_msg;
  button_status;

  inputArray=[];

  constructor(private _fb: FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute, private http: HttpClient,
              private router: Router,private dataservice: DataService,
              private authenticationService: UserService) { }


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
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
    window.scrollTo(0, 0);

  }

  currentWork(){
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
  }
  message;
  current_work_check=[];
  ngOnInit()
  {
    this.salary='';
    this.current_currency =-1;
    this.jobData = [];
    this.eduData=[];
    // this.dataservice.currentMessage.subscribe(message => this.message = message);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.shown=true;
    //this.currentdate = this.datePipe.transform(this.today, 'MMM');
    //this.currentyear = this.datePipe.transform(this.today, 'yyyy');
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
    if(this.currentUser && this.currentUser.type == 'candidate')
    {
      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data => {
            //console.log(data.education_history_history);

            if(data['terms_id'])
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }
            if(data['description'])
            {

              this.exp_active_class = 'fa fa-check-circle text-success';
            }
            if(data['locations'] && data['roles'] && data['interest_area'] || data['expected_salary'] || data['availability_day'])
            {
              this.active_class='fa fa-check-circle text-success';
              // this.job_active_class = 'fa fa-check-circle text-success';

            }
            if(data['work_history'] || data['education_history'] || data['programming_languages'])
            {

              if(data['work_history'].length>0)
              {
                this.jobData = data['work_history'];
                // console.log(this.jobData);
                //console.log(this.jobData.startdate);
                // console.log(this.datePipe.transform(((this.jobData.startdate)+1), 'MMMM'));


                for(let data1 of data['work_history'])
                {
                  //this.companyname = data1.companyname;
                  this.current_work_check.push(data1.currentwork);


                }


                this.ExperienceForm = this._fb.group({
                  ExpItems: this._fb.array(
                    this.history_data()
                  )
                });
              }
              if(data['education_history'].length>0)
              {

                this.eduData = data['education_history'];
                this.EducationForm = this._fb.group({
                  itemRows: this._fb.array(
                    this.education_data()
                  )
                });

              }
              //this.exp_data.push(data.experience_roles) ;
              ////console.log(data.experience_roles.length);
              if(data['programming_languages'])
              {
                this.expYear = data['programming_languages'];
                for (let key of data['programming_languages'])
                {
                  for(var i in key)
                  {


                    for(let option of this.language_opt)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.db_valye.push(key[i]);
                        this.db_lang= ({value: key[i]});
                        this.language.push(this.db_lang);
                        //this.language_exp.push(key[i]);
                      }
                      else
                      {

                      }

                    }

                    for(let option of this.exp_year)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;

                        //this.expYear.push(option);
                        this.expYear_db.push(key[i]);
                        ////console.log(this.expYear_db);

                      }

                    }

                  }
                }
              }


              this.salary = data['current_salary'];
              this.Intro =data['description'];
              if(data['current_currency'])
              {
                this.current_currency =data['current_currency'];
              }
              // this.current_currency =-1;

            }


            if(!data['why_work'])
            {
              this.router.navigate(['/resume']);
            }



            else
            {
              //this.router.navigate(['/resume']);
            }

          },
          error=>
          {
            if(error['message'] === 500 || error['message'] === 401)
            {
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
              this.candidateMsgTitle= data[0]['page_title'];
              this.candidateMsgBody = data[0]['page_content'];
            }
          });
    }
    else
    {
      this.router.navigate(['/not_found']);
    }



  }

  currency=
    [
      "£ GBP" ,"€ EUR" , "$ USD"
    ]

  current_work=
    [
      {name:'I currently work here', value:'current', checked:false}
    ]

  language_opt=
    [
      {name:'Java', value:'Java', checked:false},{name:'C', value:'C', checked:false},
      {name:'C++', value:'C++', checked:false},{name:'C#', value:'C#', checked:false},
      {name:'Python', value:'Python', checked:false},{name:'Visual Basic .NET', value:'Visual Basic .NET', checked:false},
      {name:'PHP', value:'PHP', checked:false},{name:'JavaScript', value:'JavaScript', checked:false},
      {name:'Delphi/Object Pascal', value:'Delphi/Object Pascal', checked:false},{name:'Swift', value:'Swift', checked:false},
      {name:'Perl', value:'Perl', checked:false},{name:'Ruby', value:'Ruby', checked:false},
      {name:'Assembly language', value:'Assembly language', checked:false},{name:'R', value:'R', checked:false},
      {name:'Visual Basic', value:'Visual Basic', checked:false},{name:'Objective-C', value:'Objective-C', checked:false},
      {name:'Go', value:'Go', checked:false},{name:'MATLAB', value:'MATLAB', checked:false},
      {name:'PL/SQL', value:'PL/SQL', checked:false},{name:'Scratch', value:'Scratch', checked:false},
      {name:'Solidity', value:'Solidity', checked:false},{name:'Serpent', value:'Serpent', checked:false},
      {name:'LLL', value:'LLL', checked:false},{name:'Nodejs', value:'Nodejs', checked:false},
      {name:'Scala', value:'Scala', checked:false},{name:'Rust', value:'Rust', checked:false},
      {name:'Kotlin', value:'Kotlin', checked:false},{name:'Haskell', value:'Haskell', checked:false},

    ]

  exp_year=
    [
      {name:'0-1', value:'0-1', checked:false},
      {name:'1-2', value:'1-2', checked:false},
      {name:'2-4', value:'2-4', checked:false},
      {name:'4-6', value:'4-6', checked:false},
      {name:'6+', value:'6+', checked:false}
    ]

  roles_opt =
    [
      {name:'Backend Developer', value:'Backend Developer', checked:false},
      {name:'BI Engineer', value:'BI Engineer', checked:false},
      {name:'Big Data Engineer', value:'Big Data Engineer', checked:false},
      {name:'CTO', value:'CTO', checked:false},
      {name:'Lead Developer', value:'Lead Developer', checked:false},
      {name:'Database Administrator', value:'Database Administrator', checked:false},
      {name:'Security Engineer', value:'Security Engineer', checked:false},
      {name:'Frontend Developer', value:'Frontend Developer', checked:false},
    ]

  year=
    [
      "2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009","2008","2007","2006","2005","2004","2003","2002","2001","2000","1999","1998","1997","1996","1995","1994"
    ]
  month= ["January","February","March","April","May","June","July","August","September","October","November","December"]

  onExpOptions(obj)
  {

    let updateItem = this.language.find(this.findIndexToUpdate, obj.value);
    let index = this.language.indexOf(updateItem);
    if(index > -1)
    {
      this.language.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.expYear, 'language', obj.value);
      ////console.log(updateItem2);
      let index2 = this.expYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.expYear.splice(index2, 1);

      }
    }
    else
    {
      obj.checked =true;
      this.language.push(obj);
    }

    // //console.log(this.language);
    ////console.log(this.expYear);

  }


  findIndexToUpdate(obj)
  {
    return obj.value === this;
  }


  onJobSelected(event)
  {
    this.yearselected= event.target.value;
    //this.position = event.target.value;
  }

  initItemRows()
  {
    return this._fb.group({
      uniname: [''],
      degreename:[''],
      fieldname:[''],
      eduyear:[]
    });
  }

  initItemRows_db()
  {
    return this._fb.group({
      uniname: [this.uniname],
      degreename:[this.degreename],
      fieldname:[this.fieldname],
      eduyear:[]
    });


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
  addNewRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    control.push(this.initItemRows());
  }

  deleteRow(index: number)
  {

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
  experience_submit(searchForm: NgForm)
  {
    this.error_msg="";
    this.edu_count=0;
    this.exp_count =0;
    this.button_status = 'submit';


    if(this.expYear.length !== this.language.length)
    {

      this.exp_lang_log="Please fill year of experience";
    }
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
        if(this.EducationForm.value.itemRows[key].uniname && this.EducationForm.value.itemRows[key].degreename && this.EducationForm.value.itemRows[key].fieldname && this.EducationForm.value.itemRows[key].eduyear)
        {

          this.edu_count = this.edu_count + 1;
        }

      }

    }
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
          this.ExperienceForm.value.ExpItems[key].startyear && this.ExperienceForm.value.ExpItems[key].end_date &&
          this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork==false)
        {
          this.exp_count = this.exp_count + 1;

        }


        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname && this.ExperienceForm.value.ExpItems[key].positionname !== "" &&
          this.ExperienceForm.value.ExpItems[key].locationname &&this.ExperienceForm.value.ExpItems[key].locationname !== "" && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear &&  this.ExperienceForm.value.ExpItems[key].currentwork==true)
        {
          this.exp_count = this.exp_count + 1;

        }

      }

    }


    console.log("language length " + this.language.length);
    console.log("experience year length " + this.expYear.length);
    console.log("education count " + this.edu_count);
    console.log("education form count " + this.EducationForm.value.itemRows.length);
    console.log("work history count " + this.exp_count);
    console.log("work history form count " + this.ExperienceForm.value.ExpItems.length);
    if(this.expYear.length === this.language.length && this.Intro && this.edu_count === this.EducationForm.value.itemRows.length && this.exp_count === this.ExperienceForm.value.ExpItems.length )
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
  submit_info(searchForm )
  {
    this.experiencearray=[];
    this.education_json_array=[];
    this.log='';


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


    this.authenticationService.experience(this.currentUser._creator, searchForm.value, this.education_json_array , this.experiencearray , searchForm.value.language_experience_year, searchForm.value. role_experience_year)
      .subscribe(
        data => {
          if(data)
          {

            $("#popModal").modal({
              backdrop: 'static',
              keyboard: true,
              show: true
            });

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
    $('#popModal').modal('hide');
    this.router.navigate(['/candidate_profile']);
  }
  selectedValue;langValue;
  onExpYearOptions(e, value)
  {
    this.selectedValue = e.target.value;
    this.langValue = value;


    let updateItem = this.findObjectByKey(this.expYear, 'language', value);
    ////console.log(updateItem);
    let index = this.expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.expYear.splice(index, 1);
      this.value=value;
      this.referringData = { language :this.value, exp_year: e.target.value};
      this.expYear.push(this.referringData);
      ////console.log(this.LangexpYear);


    }
    else
    {
      ////console.log("not exists");
      this.value=value;
      this.referringData = { language :this.value, exp_year: e.target.value};
      this.expYear.push(this.referringData);
      ////console.log(this.LangexpYear);

    }
    //console.log(this.expYear);
  }

  findObjectByKey(array, key, value)
  {
    // //console.log(array.length);
    for (var i = 0; i < array.length; i++)
    {
      // //console.log(array[i][key]);
      if (array[i][key] === value)
      {
        // //console.log( array[i]);
        return array[i];
      }

    }
    return null;
  }

  onRoleYearOptions(e, value)
  {
    this.value=value;
    this.referringData = { platform_name:this.value, exp_year: e.target.value};
    this.expYearRole.push(this.referringData);

  }

  work_start_data(e)
  {
    this.start_month = e.target.value ;
  }
  work_start_year(e)
  {
    this.start_year= e.target.value;
  }
}
