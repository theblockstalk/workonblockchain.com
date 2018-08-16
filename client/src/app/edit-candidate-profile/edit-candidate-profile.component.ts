import { Component, OnInit ,ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import { DataService } from "../data.service";
import {environment} from '../../environments/environment';
const URL = environment.backend_url;
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-candidate-profile',
  templateUrl: './edit-candidate-profile.component.html',
  styleUrls: ['./edit-candidate-profile.component.css']
})
export class EditCandidateProfileComponent implements OnInit {
    
  currentUser: User;
  info: any = {}; log;
  selectedValue = [];
  selectedcountry = [];
  expYear=[];jobselected=[]; salary;
  availability_day;base_currency;
  experimented_platform = [];
  commercially_worked = [];
  platform=[];expYear_db=[];
  referringData;value;why_work;
  commercial_expYear=[];db_valye=[];db_lang;
  exp_db_lang;exp_db_valye=[];exp_expYear=[];
  platforms_designed=[];platforms=[];plat_db_valye=[];
  platformreferringData;designed_expYear_db=[];
  EducationForm: FormGroup;
  ExperienceForm: FormGroup;
  language=[]; yearselected; work_experience_year;
    today = Date.now();
    currentdate;currentyear;
    expYearRole=[];start_month;start_year;
    companyname;positionname;locationname;descname;startdate;startyear;enddate;endyear;
    currentwork;currentenddate;currentendyear; uniname;degreename;fieldname;edudate;eduyear; 
    eduData; jobData;Intro;
    current_currency;
    LangexpYear=[];lang_expYear_db=[];lang_db_valye=[];
    candidate_data=[];
    img_src;
  nationality = ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dominican', 'Dutch', 'Dutchman', 'Dutchwoman', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlander', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'];
 
    current_work_check=[];
    current_work= 
    [
        {name:'I currently work there', value:'current', checked:false}
    ]
    
  constructor(private dataservice: DataService,private datePipe: DatePipe,private _fb: FormBuilder,private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef) 
  { 
  }
    
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
    return this.calen_month[monthnum-1] || '';
}
    
    
  ngOnInit() 
  {
      /* $(document).ready(function(){
        $(function () {
    $('#1step').change(function () {
        if ($('#1step').is(':checked')) {
            $("#input_field").hide();
        } else {
            $("#input_field").show();
        }
    }).change();
});
    });*/
    
      this.info.nationality = -1;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
       this.EducationForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]) 
      });

      this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()]) 
      });
      if(this.currentUser && this.currentUser.type=='candidate')
      {
          this.authenticationService.getById(this.currentUser._id)
            .subscribe(data => 
            {
                if(data.contact_number  && data.nationality && data.first_name && data.last_name)
                {
                   this.info.email = data._creator.email;
                    this.info.contact_number = data.contact_number;
                    this.info.github_account = data.github_account;
                    this.info.exchange_account = data.stackexchange_account;
                    this.info.nationality = data.nationality;
                    //this.info.gender = data.gender;
                    this.info.first_name =data.first_name;
                    this.info.last_name =data.last_name;

                    if(data.image != null )
                    {
                      ////console.log(data.image);
                     this.info.image_src =  data.image ;
                        let x = this.info.image_src.split("/");
     
                        let last:any = x[x.length-1];
                           
                           this.img_src = last;
                    }
                    
                               
                }
                
                if(data.locations && data.roles && data.interest_area &&  data.expected_salary && data.availability_day && data.expected_salary_currency)
                {
                    for (let country1 of data.locations) 
                     {
                      
                      for(let option of this.options)
                      {

                        if(option.value == country1)
                        {
                          option.checked=true;
                          this.selectedcountry.push(country1);
                          
                        }
                       
                      }
                      
                    }
                    
                     for(let interest of data.interest_area) 
                     {
                      
                      for(let option of this.area_interested)
                      {

                        if(option.value == interest)
                        {
                          option.checked=true;
                          this.selectedValue.push(interest);
                          
                        }
                       
                      }
                      
                    }
                   // this.jobselected=data.roles;
                    
                    //this.selectedValue = data.interest_area;
                    for (let area of data.roles) 
                     {
                      
                      for(let option of this.dropdown_options)
                      {
                       // //console.log(option);
                        if(option.value == area)
                        {
                          option.checked=true;
                          this.jobselected.push(area);
                          
                        }
                       
                      }
                      
                    }
          
                    this.salary = data.expected_salary;
                    this.availability_day = data.availability_day;
                    this.base_currency = data.expected_salary_currency;
                }
                
                if(data.commercial_platform || data.experimented_platform || data.why_work || data.platforms)
                {
                  this.why_work=data.why_work;
              
                    if(data.commercial_platform)
                    {
                      this.commercial_expYear =data.commercial_platform;
                     for (let key of data.commercial_platform) 
                      {
                        for(var i in key)
                        {


                          for(let option of this.commercially)
                          {
                            
                            if(option.value == key[i])
                            {
                              option.checked=true;
                              this.db_valye.push(key[i]);
                              this.db_lang= ({value: key[i]});
                              this.commercially_worked.push(this.db_lang);
                              
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
                                   
                                //this.commercial_expYear.push(option);
                                this.expYear_db.push(key[i]);
                                ////console.log(this.expYear_db); 
                                 
                            }
                       
                          }
                          
                        }
                      }
                        
                     }
                    
                    
                      if(data.platforms)
                      {
                          this.platforms = data.platforms;
                      for (let key of data.platforms) 
                      {
                        for(var i in key)
                        {


                          for(let option of this.designed)
                          {
                            
                            if(option.value == key[i])
                            {
                              option.checked=true;
                              this.plat_db_valye.push(key[i]);
                              this.db_lang= ({value: key[i]});
                              this.platforms_designed.push(this.db_lang);
                              
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
                                   
                                
                                this.designed_expYear_db.push(key[i]);
                                
                                 
                            }
                       
                          }
                          
                        }
                      }
                     }


                      if(data.experimented_platform)
                      {
                          this.experimented_platform = [];
                           for (let plat of data.experimented_platform) 
                     {
                      
                      for(let option of this.experimented)
                      {

                        if(option.value == plat.value)
                        {
                          option.checked=true;
                          this.experimented_platform.push(option);
                          
                        }
                       
                      }
                      
                    }
                     }
                }
                
                /////////////////experience////////////////////////
                if(data.work_history && data.education_history|| data.programming_languages&&data.current_salary && data.current_currency)
                {
                    
                   
                    
                    this.jobData = data.work_history; 
                    
                     for(let data1 of data.work_history)
                        {
                            //this.companyname = data1.companyname;
                            this.current_work_check.push(data1.currentwork);
                            console.log(this.current_work_check);
                       
                        }
                    
                    this.ExperienceForm = this._fb.group({
                              ExpItems: this._fb.array(
                                    this.history_data()
                          ) 
                          });
                 
                    this.eduData = data.education_history; 
                    this.EducationForm = this._fb.group({
                          itemRows: this._fb.array(
                                    this.education_data()
                          )
                        });
                        //this.exp_data.push(data.programming_languages) ;
                       if(data.programming_languages)
                       {
                           this.LangexpYear = data.programming_languages;
                      for (let key of data.programming_languages) 
                      {
                        for(var i in key)
                        {


                          for(let option of this.language_opt)
                          {
                            
                            if(option.value == key[i])
                            {
                              option.checked=true;
                              this.lang_db_valye.push(key[i]);
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
                                this.lang_expYear_db.push(key[i]);
                                //console.log(this.lang_expYear_db); 
                                 
                            }
                       
                          }
                          
                        }
                      }
                    }                    

                    this.salary = data.current_salary;
                    this.Intro =data.description;
                    this.current_currency =data.current_currency;

                }
            },
            error => 
            {
               this.log = 'Something getting wrong';
            });
      }
  }
    gender = 
  [
    "Male", 
    "Female"
  ]
  /*currency=
    [
      "£ GBP" ,"€ EUR" , "$ USD"
    ]*/
    currency=
    [
      "Â£ GBP" ,"â‚¬ EUR" , "$ USD"
    ]

  experience=
  [
    {name:'0-1', value:'0-1', checked:false},
    {name:'1-2', value:'1-2', checked:false},
    {name:'2-4', value:'2-4', checked:false},
    {name:'4-6', value:'4-6', checked:false},
    {name:'6+', value:'6+', checked:false}
  ]

  countries = 
  [
    {id:'000' , value:''},
    {id:'001' , value:'France'},
    {id:'002' , value:'United Kingdom'},
    {id:'003' , value:'Ireland'},
    {id:'004' , value:'Netherlands'},
    {id:'005' , value:'Germany'},
    {id:'006' , value:'Israel'},
    {id:'007' , value:'Spain'},
    
  ]
  options = 
  [
    {country_code:'000' , name:'Remote', value:'remote', checked:false},
    {country_code:'001' ,name:'Paris', value:'Paris', checked:false},
    {country_code:'001' ,name:'London', value:'London', checked:false}, 
    {country_code: '001' ,name:'Dublin', value:'Dublin', checked:false},
    {country_code: '001' ,name:'Amsterdam', value:'Amsterdam', checked:false},
    {country_code: '001' ,name:'Berlin', value:'Berlin', checked:false},
    {country_code: '002' ,name:'Munich', value:'Munich', checked:false},
    {country_code: '002' ,name:'San Francisco', value:'San Francisco', checked:false},
    {country_code: '002' ,name:'New York', value:'New York', checked:false},
    {country_code: '002' ,name:'Los Angeles', value:'Los Angeles', checked:false},
    {country_code: '002' ,name:'Boston', value:'Boston', checked:false},
    {country_code: '003' ,name:'Chicago', value:'Chicago', checked:false},
    {country_code: '004' ,name:'Austin', value:'Austin', checked:false},
    {country_code: '004' ,name:'Zug', value:'Zug', checked:false},
    {country_code: '004' ,name:'Zurich', value:'Zurich', checked:false},
    {country_code: '004' ,name:'Edinburgh', value:'Edinburgh', checked:false},
    {country_code: '004' ,name:'Copenhagen', value:'Copenhagen', checked:false},
    {country_code: '004' ,name:'Stockholm', value:'Stockholm', checked:false},
    {country_code: '004' ,name:'Madrid', value:'Madrid', checked:false},
    
  ]

  dropdown_options = 
  [
    {name:'Backend Developer', value:'Backend Developer', checked:false},
    {name:'Frontend Developer', value:'Frontend Developer', checked:false},
    {name:'UI Developer', value:'UI Developer', checked:false},
    {name:'UX Designer', value:'UX Designer', checked:false},
    {name:'Fullstack Developer', value:'Fullstack Developer', checked:false},
    {name:'Blockchain Developer', value:'Blockchain Developer', checked:false},
    {name:'Smart Contract Developer', value:'Smart Contract Developer', checked:false},
    {name:'Architect', value:'Architect', checked:false},
    {name:'DevOps', value:'DevOps', checked:false},
    {name:'Software Tester', value:'Software Tester', checked:false},
    {name:'CTO', value:'CTO', checked:false},
    {name:'Technical Lead', value:'Technical Lead', checked:false},
    {name:'Product Manager', value:'Product Manager', checked:false},
    {name:'Intern Developer', value:'Intern Developer', checked:false},
    {name:'Researcher ', value:'Researcher ', checked:false},
  ]

  area_interested=
  [
    {name:'Enterprise blockchain', value:'Enterprise blockchain', checked:false},
    {name:'Public blockchain', value:'Public blockchain', checked:false},
    {name:'Blockchain infrastructure', value:'Blockchain infrastructure', checked:false},
    {name:'Smart contract development', value:'Smart contract development', checked:false},
    {name:'Decentralized applications (dapps)', value:'Decentralized applications (dapps)', checked:false},
    {name:"I don't know", value:"I don't know", checked:false},
  ]

  

  year=
  [
    "2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009","2008","2007","2006","2005","2004","2003","2002","2001","2000","1999","1998","1997","1996","1995","1994"
  ]
  
  month= ["Now","1 month","2 months","3 months","Longer than 3 months"]
    
    
    commercially=
  [ 
    {name:'Bitcoin', value:'Bitcoin', checked:false},
    {name:'Ethereum', value:'Ethereum', checked:false},
    {name:'Ripple', value:'Ripple', checked:false},
    {name:'Stellar', value:'Stellar', checked:false},
    {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
    {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
    {name:'Quorum', value:'Quorum', checked:false},
    {name:'Corda', value:'Corda', checked:false},
    {name:'EOS', value:'EOS', checked:false},
    {name:'NEO', value:'NEO', checked:false},
    {name:'Waves', value:'Waves', checked:false},
    {name:'Steem', value:'Steem', checked:false},
    {name:'Lisk', value:'Lisk', checked:false},
    {name:'Quantum', value:'Quantum', checked:false},
    {name:'Tezos', value:'Tezos', checked:false},
    {name:'Cardano', value:'Cardano', checked:false},
    {name:'Litecoin', value:'Litecoin', checked:false},
    {name:'Monero', value:'Monero', checked:false},
    {name:'ZCash', value:'ZCash', checked:false},
    {name:'IOTA', value:'IOTA', checked:false},
    {name:'NEM', value:'NEM', checked:false},
    {name:'NXT', value:'NXT', checked:false},
    
  ]

  designed=
  [
     {name:'Bitcoin', value:'Bitcoin', checked:false},
    {name:'Ethereum', value:'Ethereum', checked:false},
    {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
    {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
    {name:'Quorum', value:'Quorum', checked:false},
     {name:'Corda', value:'Corda', checked:false},
    {name:'Waves', value:'Waves', checked:false},
    {name:'NEO', value:'NEO', checked:false},
    {name:'EOS', value:'EOS', checked:false},
    {name:'Lisk', value:'Lisk', checked:false},
    {name:'Quantum', value:'Quantum', checked:false},
    {name:'Cardano', value:'Cardano', checked:false},
    {name:'NEM', value:'NEM', checked:false},
    {name:'NXT', value:'NXT', checked:false},
  ]

  experimented=
  [
      {name:'Bitcoin', value:'Bitcoin', checked:false},
      {name:'Ethereum', value:'Ethereum', checked:false},
      {name:'Ripple', value:'Ripple', checked:false},
      {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
      {name:'Corda', value:'Corda', checked:false},
      {name:'EOS', value:'EOS', checked:false},
      {name:'Waves', value:'Waves', checked:false},
      {name:'Steem', value:'Steem', checked:false},
      {name:'Lisk', value:'Lisk', checked:false},
      {name:'Quantum', value:'Quantum', checked:false},
      {name:'Tezos', value:'Tezos', checked:false},
      {name:'Cardano', value:'Cardano', checked:false},
      {name:'Litecoin', value:'Litecoin', checked:false},
      {name:'Monero', value:'Monero', checked:false},
      {name:'ZCash', value:'ZCash', checked:false},
      {name:'IOTA', value:'IOTA', checked:false},
      {name:'NEM', value:'NEM', checked:false},
      {name:'NXT', value:'NXT', checked:false},
      {name:'Dash', value:'Dash', checked:false},
      {name:'Doge', value:'Doge', checked:false},
  ]

   exp_year=
  [
    {name:'0-1', value:'0-1', checked:false},
    {name:'1-2', value:'1-2', checked:false},
    {name:'2-4', value:'2-4', checked:false},
    {name:'4-6', value:'4-6', checked:false},
    {name:'6+', value:'6+', checked:false}
  ]

  onExpOptions(obj)
  {
//console.log(this.experimented_platform);
      let updateItem = this.experimented_platform.find(this.findIndexToUpdate, obj.value);
      let index = this.experimented_platform.indexOf(updateItem);
      if(index > -1)
      {
        this.experimented_platform.splice(index, 1);
          //console.log("if");
        
      }
      else
      {
          //console.log("else");
        obj.checked =true;
        this.experimented_platform.push(obj);
      }

       /*let updateItem = this.experimented_platform.find(this.findIndexToUpdate, obj.value);
      let index = this.experimented_platform.indexOf(updateItem);
      if(index > -1)
      {
        this.experimented_platform.splice(index, 1);
          let updateItem2 = this.findObjectByKey(this.expYear, 'experimented_platform', obj.value);
       ////console.log(updateItem);
      let index2 = this.expYear.indexOf(updateItem2);

      if(index2 > -1)
      {
          
        this.expYear.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.experimented_platform.push(obj);
      }*/
      
    
      
  }


   oncommerciallyOptions(obj)
   {
    
   let updateItem = this.commercially_worked.find(this.findIndexToUpdate_funct, obj.value);
      let index = this.commercially_worked.indexOf(updateItem);
      if(index > -1)
      {
        this.commercially_worked.splice(index, 1);
          let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'platform_name', obj.value);
        ////console.log(updateItem);
        let index2 = this.commercial_expYear.indexOf(updateItem2);

        if(index2 > -1)
        {
          
            this.commercial_expYear.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.commercially_worked.push(obj);
      }

      
   }

   onPlatformOptions(obj)
   {
    
   let updateItem = this.platforms_designed.find(this.findIndexToUpdate_funct, obj.value);
      let index = this.platforms_designed.indexOf(updateItem);
      if(index > -1)
      {
        this.platforms_designed.splice(index, 1);
        let updateItem2 = this.findObjectByKey(this.platforms, 'platform_name', obj.value);
       ////console.log(updateItem);
      let index2 = this.platforms.indexOf(updateItem2);

      if(index2 > -1)
      {
          
        this.platforms.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.platforms_designed.push(obj);
      }

      
   }

   onExpYearOptions(e , value)
   {      

      let updateItem = this.findObjectByKey(this.expYear, 'experimented_platform', value);
       ////console.log(updateItem);
      let index = this.expYear.indexOf(updateItem);

      if(index > -1)
      {
          
        this.expYear.splice(index, 1);
        this.value=value;
        this.referringData = { experimented_platform:this.value, exp_year: e.target.value};  
        this.expYear.push(this.referringData); 
        //console.log(this.expYear); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
        this.referringData = { experimented_platform:this.value, exp_year: e.target.value};  
        this.expYear.push(this.referringData); 
        //console.log(this.expYear); 
        
      }
       
      // 
    
   }

   onComExpYearOptions(e, value)
   {
      
      /*this.value=value;
     this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData); */
       
       let updateItem = this.findObjectByKey(this.commercial_expYear, 'platform_name', value);
       ////console.log(updateItem);
      let index = this.commercial_expYear.indexOf(updateItem);

      if(index > -1)
      {
          
        this.commercial_expYear.splice(index, 1);
        this.value=value;
        this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
        this.commercial_expYear.push(this.referringData); 
        //console.log(this.commercial_expYear); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
        this.referringData = { platform_name :this.value, exp_year: e.target.value};   
        this.commercial_expYear.push(this.referringData); 
        //console.log(this.commercial_expYear); 
        
      }
       
           
   }
  

   onPlatformYearOptions(e, value)
   {
      
     /* this.value=value;
      this.platformreferringData = { platform_name:this.value, exp_year: e.target.value}; 
      this.platforms.push(this.platformreferringData); 
      //console.log(this.platforms);*/
       
       
       let updateItem = this.findObjectByKey(this.platforms, 'platform_name', value);
       ////console.log(updateItem);
      let index = this.platforms.indexOf(updateItem);

      if(index > -1)
      {
          
        this.platforms.splice(index, 1);
        this.value=value;
        this.platformreferringData = { platform_name:this.value, exp_year: e.target.value}; 
      this.platforms.push(this.platformreferringData);  
        ////console.log(this.expYear); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
         this.platformreferringData = { platform_name:this.value, exp_year: e.target.value}; 
      this.platforms.push(this.platformreferringData); 
        ////console.log(this.expYear); 
        
      }
       
      
   }
    
    findObjectByKey(array, key, value) {
      // //console.log(array.length);
    for (var i = 0; i < array.length; i++) {
       // //console.log(array[i][key]);
        if (array[i][key] === value) {
           // //console.log( array[i]);
            return array[i];
        }
       
    }
    return null;
    }
    
    ///////////////////experience///////////////////////////////
    calen_month= ["January","Februray","March","April","May","June","July","August","September","October","November","December"]


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

   
    onLangExpOptions(obj)
    {
      let updateItem = this.language.find(this.findIndexToUpdate_funct, obj.value);
      let index = this.language.indexOf(updateItem);
      if(index > -1)
      {
        this.language.splice(index, 1);
        let updateItem2 = this.findObjectByKey(this.LangexpYear, 'language', obj.value);
          ////console.log(updateItem);
        let index2 = this.LangexpYear.indexOf(updateItem2);

        if(index2 > -1)
        {
          
            this.LangexpYear.splice(index2, 1);
        }
      }
      else
      {
        obj.checked =true;
        this.language.push(obj);
      }

      //console.log(this.language);
    
    }

    
    findIndexToUpdate_funct(obj) 
    { 
        return obj.value === this;
    }
    
    findIndexToUpdate(type) { 
   ////console.log("funct");
        return type == this;
    }

    onJobSelected(e)
    {
        //this.yearselected= event.target.value;
        if(e.target.checked)
        {
            this.jobselected.push(e.target.value);
            ////console.log("if");
        }
        else{
    
        let updateItem = this.jobselected.find(this.findIndexToUpdate, e.target.value);

        let index = this.jobselected.indexOf(updateItem);

        this.jobselected.splice(index, 1);
        }
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
        edudate:[this.edudate],
        eduyear:[this.eduyear]
      });


    }

    initExpRows_db() 
    {
      return this._fb.group({
        companyname: [this.companyname],
        positionname:[this.positionname],
        locationname: [this.locationname],
        descname: [this.descname] ,
        startdate:[this.startdate],
        startyear:[this.startyear],
        enddate:[this.enddate],
        endyear:[this.endyear],
        currentwork:[this.currentwork],
        currentenddate:[this.currentdate],
        currentendyear:[this.currentyear]
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
    
  get DynamicWorkFormControls() 
  {

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

    onCurrentlyWork(e)
    {
 
    }
   
    onLangExpYearOptions(e, value)
   {
        
        
        
      let updateItem = this.findObjectByKey(this.LangexpYear, 'language', value);
       ////console.log(updateItem);
      let index = this.LangexpYear.indexOf(updateItem);

      if(index > -1)
      {
          
        this.LangexpYear.splice(index, 1);
        this.value=value;
        this.referringData = { language:this.value, exp_year: e.target.value};  
        this.LangexpYear.push(this.referringData); 
        ////console.log(this.LangexpYear); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
        this.referringData = { language:this.value, exp_year: e.target.value};  
        this.LangexpYear.push(this.referringData); 
        ////console.log(this.LangexpYear); 
        
      }
                ////console.log(this.LangexpYear); 

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
    
     onAreaSelected(e)
  {
    //this.jobselected= e.target.value;
  
     if(e.target.checked)
     {
      this.selectedValue.push(e.target.value);
      ////console.log("if");
    }
    else{
    ////console.log("else");
     let updateItem = this.selectedValue.find(this.findIndexToUpdate, e.target.value);

     let index = this.selectedValue.indexOf(updateItem);

     this.selectedValue.splice(index, 1);
    }

  }
    
    updateCheckedOptions(e) 
  {
    //this.interest = e.target.value;
   
     if(e.target.checked)
     {
      this.selectedcountry.push(e.target.value);
      ////console.log("if");
    }
    else{
    ////console.log("else");
     let updateItem = this.selectedcountry.find(this.findIndexToUpdate, e.target.value);

     let index = this.selectedcountry.indexOf(updateItem);

     this.selectedcountry.splice(index, 1);
    }

    //console.log(this.selectedcountry);

  }
    ////////////////////////save edit profile data//////////////////////////////////
    month_number;start_monthh;
    experiencearray=[];
    experiencejson;
    monthNameToNum(monthname) {
        this.start_monthh = this.calen_month.indexOf(monthname);
        this.start_monthh = "0"  + (this.start_monthh);
        return this.start_monthh ?  this.start_monthh : 0;
    }
    startmonthIndex;endmonthIndex;
    start_date_format;end_date_format;
    educationjson;education_json_array=[];
    candidate_profile(profileForm: NgForm)
    {
        //console.log(profileForm.value);
         this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        for (var key in this.ExperienceForm.value.ExpItems) 
            {
                this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
                this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);              
                //this.ExperienceForm.value.ExpItems[key].startdate = "01/"+this.startmonthIndex + "/" + this.ExperienceForm.value.ExpItems[key].startyear;
                //this.ExperienceForm.value.ExpItems[key].enddate ="01/"+ this.endmonthIndex + "/" + this.ExperienceForm.value.ExpItems[key].endyear;
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
        this.authenticationService.edit_candidate_profile(this.currentUser._creator,profileForm.value,this.education_json_array , this.experiencearray)
            .subscribe(
                data => {
                if(data && this.currentUser)
                {
                     let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
                     let fileCount: number = inputEl.files.length;
                     let formData = new FormData();
                     if (fileCount > 0 ) 
                     { 
                        formData.append('photo', inputEl.files.item(0));
                    
                        this.http.post(URL+'users/image/'+this.currentUser._creator, formData).map((res) => res).subscribe(                
                        (success) => 
                        {
                             //console.log(success);
                             //window.location.href = '/candidate_profile';

                              this.router.navigate(['/candidate_profile']); 
                        },
                        (error) => console.log(error))
                     }
                     else
                          //window.location.href = '/candidate_profile';

                        this.router.navigate(['/candidate_profile']);
                }

                if(data.error)
                {
                    //this.log=data.error;
                    this.dataservice.changeMessage(data.error);
                }
               
                },
                error => {
                     this.dataservice.changeMessage(error);
                  this.log = 'Something getting wrong';
                   
                });
    }
    
     onGenderSelected(event)
  {
    this.info.gender= event.target.value;
    //console.log(this.info.gender);
   
  }

}
