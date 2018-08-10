import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";


@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit 
{
    EducationForm: FormGroup;
    ExperienceForm: FormGroup;
  	language=[]; roles=[];yearselected;shown; work_experience_year;
    today = Date.now();
    currentdate;currentyear;currentUser: User;language_checked;language_exp=[];expYear_db=[];expYearRole_db=[];
    value;referringData;expYear=[];expYearRole=[];start_month;start_year;salary;db_lang;
    companyname;positionname;locationname;descname;startdate;startyear;enddate;endyear;currentwork;currentenddate;currentendyear; uniname;degreename;fieldname;edudate;eduyear; eduData; jobData;datatata=[];exp_data=[];Intro;db_valye=[];
    exp_active_class;active_class;current_currency;
    term_active_class;term_link;

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
          .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, descname:i.descname,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
      }
   
   monthNumToName(monthnum) {     
    return this.month[monthnum-2] || '';
}

    message;
    current_work_check=[];
  	ngOnInit() 
    {
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
          this.authenticationService.getById(this.currentUser._id)
            .subscribe(
            data => {
                console.log(data.education_history_history);
               
                 if(data.terms==true)
                  {
                        this.term_active_class='fa fa-check-circle text-success';
                     this.term_link = '/terms-and-condition';
                  }
                if(data.work_history || data.education_history|| data.programming_languages ||data.current_salary || data.current_currency)
                {               
                    
                    if(data.work_history.length>0)
                    {
                        this.jobData = data.work_history; 
                       // console.log(this.jobData);
                        //console.log(this.jobData[0].startdate);
                       // console.log(this.datePipe.transform(((this.jobData[0].startdate)+1), 'MMMM'));
                        
                       
                        for(let data1 of data.work_history)
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
                    if(data.education_history.length>0)
                    {
                 
                    this.eduData = data.education_history; 
                    this.EducationForm = this._fb.group({
                          itemRows: this._fb.array(
                                    this.education_data()
                          )
                        });
                        
                        }
                        //this.exp_data.push(data.experience_roles) ;
                    ////console.log(data.experience_roles.length);
                      if(data.programming_languages)
                      {
                          this.expYear = data.programming_languages;
                      for (let key of data.programming_languages) 
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
                      

                    this.salary = data.current_salary;
                    this.Intro =data.description;
                    if(data.current_currency)
                    {
                        this.current_currency =data.current_currency;
                     }
                   // this.current_currency =-1;

                }
                 if(data.work_history && data.education_history&& data.programming_languages &&data.current_salary && data.current_currency)
                 {
                     this.exp_active_class = 'fa fa-check-circle text-success';
                }
                 if(data.locations && data.roles && data.interest_area || data.expected_salary || data.availability_day )
                  {
                    this.active_class='fa fa-check-circle text-success';
                     // this.job_active_class = 'fa fa-check-circle text-success';
                       
                  }
              
              if(!data.why_work )
              {              
                this.router.navigate(['/resume']);
              }
     
             

                else
                {
                   //this.router.navigate(['/resume']);
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
        {name:'I currently work there', value:'current', checked:false}
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
    month= ["January","Februray","March","April","May","June","July","August","September","October","November","December"]

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

  	/*onRolesOptions(obj)
  	{
    	
      let updateItem = this.roles.find(this.findIndexToUpdate, obj.value);
      let index = this.roles.indexOf(updateItem);
      if(index > -1)
      {
        this.roles.splice(index, 1);
      }
      else
      {
        obj.checked=true
        this.roles.push(obj);
      }

      ////console.log(this.roles);
    
  	}
*/
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
      ////console.log(this.currentdate);
      return this._fb.group({
        companyname:[''],
        positionname:[''],
        locationname: [''],
        descname: [''] ,
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
     
      // control refers to your formarray
      const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
      // add new formgroup
      control.push(this.initExpRows());
    }

    deleteExpRow(index: number) 
    {
      // control refers to your formarray
      const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
      // remove the chosen row
      control.removeAt(index);
    }
    
  get DynamicWorkFormControls() {

    return <FormArray>this.ExperienceForm.get('ExpItems');
  }
    addNewRow() 
    {
      // control refers to your formarray
      //this.EducationForm.value.itemRows = "";
      const control = <FormArray>this.EducationForm.controls['itemRows'];
      // add new formgroup
      control.push(this.initItemRows());
    }

    deleteRow(index: number) 
    {
   
      // control refers to your formarray
      const control = <FormArray>this.EducationForm.controls['itemRows'];
      // remove the chosen row
      control.removeAt(index);
    }
    
   get DynamicEduFormControls() {

    return <FormArray>this.EducationForm.get('itemRows');
  }

   /* onCurrentlyWork(e)
    {
        ////console.log(e);
        /*if(e.target.checked==true)
        {
         
          this.shown= false;
          ////console.log(this.today);

        }
        else
        {
          this.shown= true;
        }
    }*/
    log;month_number;start_monthh;
    experiencearray=[];
    experiencejson;
    monthNameToNum(monthname) {
    this.start_monthh = this.month.indexOf(monthname);
        this.start_monthh = "0"  + (this.start_monthh + 1);
    return this.start_monthh ?  this.start_monthh : 0;
    }
    startmonthIndex;endmonthIndex;
    experience_submit(searchForm: NgForm)
    {    

       
        if(this.ExperienceForm.value.ExpItems.length == 0 )
        {
            
            this.log = "Please enter atleast one work history. "; 
            
        }
        else
        {
        
        

        if(!this.ExperienceForm.value.ExpItems[0].end_date || !this.ExperienceForm.value.ExpItems[0].endyear )
        {
            if(this.ExperienceForm.value.ExpItems[0].currentwork==false)
            {
                this.log = "Please complete all fields for each work experience.";  
               
                
            }
            else    
            {
                this.log ='';
                this.submit_info(searchForm);
            }
            
            
        }
        else
            {
            this.submit_info(searchForm);
            }
            
            }    
        
    }

    start_date_format;
    end_date_format;
    educationjson; education_json_array=[];
    submit_info(searchForm)
    {
        
     if(!this.ExperienceForm.value.ExpItems[0].companyname || !this.ExperienceForm.value.ExpItems[0].positionname ||
        !this.ExperienceForm.value.ExpItems[0].locationname   ||
        !this.ExperienceForm.value.ExpItems[0].start_date || !this.ExperienceForm.value.ExpItems[0].startyear   )
        {
             //console.log("iffff");
            this.log = "Please complete all fields for each work experience.";    
        }

        else if(this.EducationForm.value.itemRows.length == 0)
        {
         
          this.log = "Please enter atleast one education. "; 
         
         }
        else if(!this.EducationForm.value.itemRows[0].uniname || !this.EducationForm.value.itemRows[0].degreename
        || !this.EducationForm.value.itemRows[0].fieldname || !this.EducationForm.value.itemRows[0].eduyear)
        {
            //console.log("if");
            this.log = "Please complete all fields for each education record.";
            
        }
        else
             {
             //console.log("else");
             this.log='';
            for (var key in this.ExperienceForm.value.ExpItems) 
            {
                this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
                this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);              
                this.ExperienceForm.value.ExpItems[key].startdate = "01/"+this.startmonthIndex + "/" + this.ExperienceForm.value.ExpItems[key].startyear;
                this.ExperienceForm.value.ExpItems[key].enddate ="01/"+ this.endmonthIndex + "/" + this.ExperienceForm.value.ExpItems[key].endyear;
                this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
                this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);    
                this.experiencejson = {companyname : this.ExperienceForm.value.ExpItems[key].companyname , positionname : this.ExperienceForm.value.ExpItems[key].positionname,locationname : this.ExperienceForm.value.ExpItems[key].locationname,description : this.ExperienceForm.value.ExpItems[key].descname,startdate : this.start_date_format,enddate : this.end_date_format , currentwork : this.ExperienceForm.value.ExpItems[key].currentwork}; 
                this.experiencearray.push(this.experiencejson);
                //console.log(this.experiencearray);

            }
         
            for ( var key in this.EducationForm.value.itemRows)
            {
               this.EducationForm.value.itemRows[key].eduyear =  parseInt(this.EducationForm.value.itemRows[key].eduyear);
             this.educationjson = {uniname : this.EducationForm.value.itemRows[key].uniname , degreename :  this.EducationForm.value.itemRows[key].degreename
                                    ,fieldname : this.EducationForm.value.itemRows[key].fieldname , eduyear : this.EducationForm.value.itemRows[key].eduyear  };
                this.education_json_array.push(this.educationjson) ;
            }
                
         console.log(this.EducationForm.value.itemRows);
            this.authenticationService.experience(this.currentUser._creator, searchForm.value, this.education_json_array , this.experiencearray , searchForm.value.language_experience_year, searchForm.value. role_experience_year)
            .subscribe(
                data => {
                if(data)
                {   //console.log("data");
                    // window.location.href = '/candidate_profile';

                    this.router.navigate(['/candidate_profile']);
                }

                if(data.error )
                {
                    ////console.log(data.error);
                }
               
                },
                error => {
                  //this.log = 'Something getting wrong';
                   
                });
             }
   
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
      ////console.log(this.expYearRole); 
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
