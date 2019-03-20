import { Component, OnInit ,ElementRef, Input,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $:any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import { DataService } from "../../data.service";
import {environment} from '../../../environments/environment';
const URL = environment.backend_url;
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-candidate-profile',
  templateUrl: './edit-candidate-profile.component.html',
  styleUrls: ['./edit-candidate-profile.component.css']
})
export class EditCandidateProfileComponent implements OnInit,AfterViewInit {

  currentUser: User;
  info: any = {}; log;
  selectedValue = [];
  selectedcountry = [];
  expYear=[];
  jobselected=[];
  salary;
  expected_salaryyy;
  availability_day;
  base_currency;
  experimented_platform = [];
  commercially_worked = [];
  platform=[];
  expYear_db=[];
  referringData;
  value;
  why_work;
  commercial_expYear=[];
  db_valye=[];
  db_lang;
  platforms_designed=[];
  platforms=[];
  plat_db_valye=[];
  platformreferringData;
  designed_expYear_db=[];
  EducationForm: FormGroup;
  ExperienceForm: FormGroup;
  language=[];
  currentdate;
  currentyear;
  expYearRole=[];
  start_month;
  start_year;
  companyname;
  positionname;
  locationname;
  description;
  startdate;
  startyear;
  enddate;
  endyear;
  currentwork;
  uniname;
  degreename;
  fieldname;
  edudate;
  eduyear;
  eduData;
  jobData;
  Intro;
  current_currency;
  LangexpYear=[];
  lang_expYear_db=[];
  lang_db_valye=[];
  img_src;
  lang_log;
  exp_lang_log;
  intro_log;
  uni_name_log;
  degree_log;
  field_log;
  eduYear_log;
  company_log;
  position_log;
  location_log;
  start_date_log;
  end_date_log;
  exp_count=0;
  edu_count=0;
  why_work_log;
  country_log;
  currency_log;
  salary_log;
  avail_log;
  current_currency_log;
  first_name_log;
  last_name_log;
  contact_name_log;
  nationality_log;
  error_msg;
  expected_validation;
  start_date_year_log;
  end_date_year_log;
  selectedValueArray=[];
  countriesModel;
  error;
  selectedLocations;
  cities;
  emptyInput;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;
  position_type = ['Full time', 'Part time'];
  employment_type_log;
  employment_location_log;
  employee_roles_log;
  work_type_log;
  selected_work_type=[];
  employeeCheck=false;
  contractorCheck=false;
  volunteerCheck=false;
  employee: any = {};
  contractor: any = {};
  volunteer: any = {};
  contractor_currency_log;
  contractor_roles_log;
  contractor_hourly_log;
  agency_website_log;
  contractor_type_log;
  contract_location_log;
  volunteer_location_log;
  volunteer_roles_log;
  objective_log;
  max_hours=[];
  validateUrl;
  skillDbArray=[];
  skillDb;
  skill_expYear_db=[];
  contract_type= [];
  volunteerArray=[];
  current_salary;
  contractorArray = [];

  nationality = ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dominican', 'Dutch', 'Dutchman', 'Dutchwoman', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlander', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'];

  current_work_check=[];
  current_work=
    [
      {name:'I currently work here', value:'current', checked:false}
    ]
  countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

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
      .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, description:i.description,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
  }

  monthNumToName(monthnum) {
    return this.calen_month[monthnum-1] || '';
  }


  otherSkills =
    [
      {name:'P2P protocols', value:'P2P protocols', checked:false},
      {name:'Distributed computing and networks', value:'Distributed computing and networks', checked:false},
      {name:'Security', value:'Security', checked:false},
      {name:'Formal verification', value:'Formal verification', checked:false},
      {name:'Cryptography', value:'Cryptography', checked:false},
      {name:'Game theory', value:'Game theory', checked:false},
      {name:'Economics', value:'Economics', checked:false},
      {name:'Smart contract audits', value:'Smart contract audits', checked:false},
      {name:'Zero Knowlege Proofs', value:'Zero Knowlege Proofs', checked:false},
    ]
  otherFormalSkills =
    [
      {name:'P2P protocols', value:'P2P protocols', checked:false},
      {name:'Distributed computing and networks', value:'Distributed computing and networks', checked:false},
      {name:'Security', value:'Security', checked:false},
      {name:'Formal verification', value:'Formal verification', checked:false},
      {name:'Cryptography', value:'Cryptography', checked:false},
      {name:'Game theory', value:'Game theory', checked:false},
      {name:'Economics', value:'Economics', checked:false},
      {name:'Smart contract audits', value:'Smart contract audits', checked:false},
      {name:'Zero Knowlege Proofs', value:'Zero Knowlege Proofs', checked:false},
    ]
  ngOnInit()
  {
    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }
    this.EducationForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });

    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });
    if(this.currentUser && this.currentUser.type=='candidate')
    {
      this.roles.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.area_interested.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.commercially.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.designed.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.experimented.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.otherSkills.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.otherFormalSkills.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.authenticationService.getProfileById(this.currentUser._id)
        .subscribe(data =>
          {
            if(data)
            {
              this.info.email = data['email'];
              if(data['candidate'].employee) {
                this.employeeCheck = true;
                this.selected_work_type.push('employee');
                let employee = data['candidate'].employee;
                this.employee.employment_type = employee.employment_type;
                this.employee.selectedLocation = employee.location;
                console.log(employee);
                console.log(this.employee.selectedLocation);
                this.selectedValueArray = employee.location;
                this.employee.roles = employee.roles;
                this.employee.expected_annual_salary = employee.expected_annual_salary;
                this.employee.currency = employee.currency;
                this.employee.employment_availability = employee.employment_availability;

              }
              if(data['candidate'].contractor) {
                this.contractorCheck = true;
                this.selected_work_type.push('contractor');
                let contractor = data['candidate'].contractor;
                this.contractor.selectedLocation = contractor.location;
                this.contractorArray = contractor.location;
                this.contractor.roles = contractor.roles;
                this.contractor.hourly_rate = contractor.expected_hourly_rate;
                this.contractor.currency = contractor.currency;
                if(contractor.max_hour_per_week) this.contractor.max_hour_per_week = contractor.max_hour_per_week;
                this.contractor.contractor_type = contractor.contractor_type;
                this.contract_type = contractor.contractor_type;
                for(let type of contractor.contractor_type)
                {

                  for(let option of this.contractor_types)
                  {

                    if(option.value === type)
                    {
                      option.checked = true;

                    }

                  }

                }

                if(contractor.agency_website) this.contractor.agency_website = contractor.agency_website;
                if(contractor.service_description) this.contractor.service_description = contractor.service_description;

              }
              if(data['candidate'].volunteer) {
                console.log("volunteer");
                this.volunteerCheck = true;
                this.selected_work_type.push('volunteer');
                let volunteer = data['candidate'].volunteer;
                console.log(volunteer.location);
                this.volunteer.selectedLocation = volunteer.location;
                this.volunteerArray = volunteer.location;

                this.volunteer.max_hours_per_week = volunteer.max_hours_per_week;
                this.volunteer.learning_objectives = volunteer.learning_objectives;
                this.volunteer.roles = volunteer.roles;
                console.log("volunteer");

                console.log(this.volunteer['volunteer_roles']);
              }
              if(data['contact_number']  || data['nationality'] || data['first_name'] || data['last_name'] || data['candidate'])
              {
                this.info.contact_number = data['contact_number'];
                if(data['candidate'].github_account) this.info.github_account = data['candidate'].github_account;
                if(data['candidate'].stackexchange_account) this.info.exchange_account = data['candidate'].stackexchange_account;
                if(data['candidate'].linkedin_account) this.info.linkedin_account = data['candidate'].linkedin_account;
                if(data['candidate'].medium_account) this.info.medium_account = data['candidate'].medium_account;
                this.info.nationality = data['nationality'];
                this.info.first_name =data['first_name'];
                this.info.last_name =data['last_name'];

                if(data['image'] != null )
                {
                  this.info.image_src =  data['image'] ;
                  let x = this.info.image_src.split("/");

                  let last:any = x[x.length-1];

                  this.img_src = last;
                }

                if(data['candidate'] && data['candidate'].base_country)
                {
                  this.info.base_country = data['candidate'].base_country;
                }
                if(data['candidate'] && data['candidate'].base_city){
                  this.info.city = data['candidate'].base_city;
                }


              }
              this.why_work=data['candidate'].why_work;
              if(data['candidate'] && data['candidate'].blockchain)
              {
                if(data['candidate'].blockchain.commercial_skills )
                {
                  this.commercialSkillsExperienceYear = data['candidate'].blockchain.commercial_skills;
                  for (let key of data['candidate'].blockchain.commercial_skills)
                  {
                    for(var i in key)
                    {

                      for(let option of this.otherSkills)
                      {

                        if(option.value === key[i])
                        {
                          option.checked=true;
                          this.skillDbArray.push(key[i]);
                          this.skillDb= ({value: key[i]});
                          this.commercialSkills.push(this.skillDb);

                        }
                        else
                        {

                        }

                      }

                      for(let option of this.exp_year)
                      {

                        if(option.value === key[i])
                        {
                          option.checked=true;
                          this.skill_expYear_db.push(key[i]);

                        }

                      }

                    }
                  }
                }

                if(data['candidate'].blockchain.description_commercial_skills)
                {
                  this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
                }

                if(data['candidate'].blockchain.commercial_platforms)
                {
                  this.commercial_expYear = data['candidate'].blockchain.commercial_platforms;
                  for (let key of data['candidate'].blockchain.commercial_platforms)
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
                          this.expYear_db.push(key[i]);

                        }

                      }

                    }
                  }

                }

                if(data['candidate'].blockchain.description_commercial_platforms)
                {
                  this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
                }

                if(data['candidate'].blockchain.experimented_platforms)
                {
                  for (let plat of data['candidate'].blockchain.experimented_platforms)
                  {

                    for(let option of this.experimented)
                    {

                      if(option.value === plat)
                      {
                        option.checked=true;
                        this.experimented_platform.push(plat);

                      }

                    }

                  }
                }

                if(data['candidate'].blockchain.description_experimented_platforms)
                {
                  this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
                }
              }




              if(data['candidate'].current_currency ){
                this.current_currency =data['candidate'].current_currency;
              }
              if(data['candidate'].current_salary) {
                this.current_salary = data['candidate'].current_salary;
              }
              this.Intro =data['candidate'].description;
              if(data['candidate'].programming_languages && data['candidate'].programming_languages.length > 0)
              {
                this.LangexpYear = data['candidate'].programming_languages;
                for (let key of data['candidate'].programming_languages)
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
                        this.lang_expYear_db.push(key[i]);

                      }

                    }

                  }
                }
              }
              if(data['candidate'].work_history) {
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

              if(data['candidate'].education_history)
              {

                this.eduData = data['candidate'].education_history;
                this.EducationForm = this._fb.group({
                  itemRows: this._fb.array(
                    this.education_data()
                  )
                });
                setTimeout(() => {
                  $('.selectpicker').selectpicker();
                }, 300);

                setTimeout(() => {
                  $('.selectpicker').selectpicker('refresh');
                }, 900);
              }
            }

          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
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
    }
  }

  ngAfterViewInit(): void
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }


  currency=
    [
      "£ GBP" ,"€ EUR" , "$ USD"
    ]

  experience=
    [
      {name:'0-1', value:'0-1', checked:false},
      {name:'1-2', value:'1-2', checked:false},
      {name:'2-4', value:'2-4', checked:false},
      {name:'4-6', value:'4-6', checked:false},
      {name:'6+', value:'6+', checked:false}
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



  graduation_year=
    [
      2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,1997,1996,1995,1994
    ]

  year=
    [
      "2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009","2008","2007","2006","2005","2004","2003","2002","2001","2000","1999","1998","1997","1996","1995","1994"
    ]

  roles = [
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
    {name:'Researcher', value:'Researcher', checked:false},
    {name:'Mobile app developer', value:'Mobile app developer', checked:false},
    {name:'Data scientist', value:'Data scientist', checked:false},
    {name:'Security specialist ', value:'Security specialist', checked:false},
  ]

  employement_availability = [
    {name: "Now" , value: "Now" },
    {name: "1 month notice period" , value: "1 month" },
    {name: "2 months notice period", value: "2 months" },
    {name: "3 months notice period", value: "3 months" },
    {name: "3+ months notice period", value: "Longer than 3 months" }
  ]

  contractor_types = [
    {name: "I work by myself as a freelancer", value: "freelance",checked:false},
    {name: "I worked through a development agency with a team", value: "agency", checked:false}
  ]

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
      {name:'Steemit', value:'Steemit', checked:false},
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
      {name:'Steemit', value:'Steemit', checked:false},
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

  onExpOptions(e)
  {

    if(e.target.checked)
    {
      this.experimented_platform.push(e.target.value);
    }
    else{
      let updateItem = this.experimented_platform.find(this.findIndexToUpdateExperimented, e.target.value);

      let index = this.experimented_platform.indexOf(updateItem);

      this.experimented_platform.splice(index, 1);
    }

  }

  findIndexToUpdateExperimented(type) {
    return type == this;
  }


  oncommerciallyOptions(obj)
  {

    let updateItem = this.commercially_worked.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.commercially_worked.indexOf(updateItem);
    if(index > -1)
    {
      this.commercially_worked.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'name', obj.value);
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

  onComExpYearOptions(e, value)
  {


    let updateItem = this.findObjectByKey(this.commercial_expYear, 'name', value);

    let index = this.commercial_expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercial_expYear.splice(index, 1);
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    this.commercial_expYear.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })

  }

  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }

    }
    return null;
  }

  calen_month= ["January","February","March","April","May","June","July","August","September","October","November","December"]


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


  onLangExpOptions(obj)
  {
    let updateItem = this.language.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.language.indexOf(updateItem);
    if(index > -1)
    {
      this.language.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.LangexpYear, 'language', obj.value);
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


  }


  findIndexToUpdate(obj)
  {
    return obj.value === this;
  }

  findIndexToUpdate_funct(obj)
  {
    return obj.value === this;
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

  currentWork(){
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 200);
  }
  addNewExpRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 200);
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
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    // control refers to your formarray
    //this.EducationForm.value.itemRows = "";
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    // add new formgroup
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

  onLangExpYearOptions(e, value)
  {

    let updateItem = this.findObjectByKey(this.LangexpYear, 'language', value);
    let index = this.LangexpYear.indexOf(updateItem);

    if(index > -1)
    {

      this.LangexpYear.splice(index, 1);
      this.value=value;
      this.referringData = { language:this.value, exp_year: e.target.value};
      this.LangexpYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { language:this.value, exp_year: e.target.value};
      this.LangexpYear.push(this.referringData);

    }

    this.LangexpYear.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    });
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

    if(e.target.checked)
    {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(this.findIndexToUpdateCheck, e.target.value);

      let index = this.selectedValue.indexOf(updateItem);

      this.selectedValue.splice(index, 1);
    }

  }

  findIndexToUpdateCheck(type) {
    return type == this;
  }
  ////////////////////////save edit profile data//////////////////////////////////
  start_monthh;
  experiencearray=[];
  experiencejson;
  monthNameToNum(monthname) {
    this.start_monthh = this.calen_month.indexOf(monthname);
    this.start_monthh = "0"  + (this.start_monthh);
    return this.start_monthh ?  this.start_monthh : 0;
  }
  startmonthIndex;
  endmonthIndex;
  start_date_format;
  end_date_format;
  educationjson;
  education_json_array=[];
  commercial_log;
  platform_log;
  base_country_log;
  city_log;
  commercial_skill_log;
  formal_skills_log;
  current_sal_log;
  count;
  validatedLocation=[];
  country_input_log;
  candidate_profile(profileForm: NgForm)
  {
    this.error_msg = "";
    this.count = 0;
    this.submit = "click";
    this.validatedLocation = [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let employeeCount = 0;
    let contractorCount = 0;
    let volunteerCount = 0;
    let inputQuery: any = {};
    if(this.employeeCheck === false && this.contractorCheck === false && this.volunteerCheck === false) {
      this.work_type_log = "Please select at least one work type";
    }
    if(this.employeeCheck) {
      if(!this.employee.employment_type) {
        this.employment_type_log = "Please choose position type";
        employeeCount = 1;
      }

      if(!this.employee.selectedLocation || (this.employee.selectedLocation && this.employee.selectedLocation.length <= 0) ) {
        this.employment_location_log = "Please select at least one location which you can work in without needing a visa";
        employeeCount = 1;
      }
      if(this.employee.selectedLocation && this.employee.selectedLocation.length > 0) {
        if(this.employee.selectedLocation.filter(i => i.visa_needed === true).length === this.employee.selectedLocation.length) {
          this.employment_location_log = "Please select at least one location which you can work in without needing a visa";
          employeeCount = 1;
        }
        this.validatedLocation = [];
        for(let location of this.employee.selectedLocation) {
          if(location.name.includes('city')) {
            this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
          }
          if(location.name.includes('country')) {
            this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
          }
          if(location.name === 'Remote') {
            this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
          }
        }
        this.employee.locations = this.validatedLocation;
      }

      if(this.employee.selectedLocation && this.employee.selectedLocation.length > 10) {
        this.employment_location_log = "Please select maximum 10 locations";
        employeeCount = 1;
      }

      if(!this.employee.roles) {
        this.employee_roles_log = "Please select minimum one role";
        employeeCount = 1;
      }

      if(!this.employee.expected_annual_salary) {
        this.salary_log = "Please enter expected yearly salary";
        employeeCount = 1;
      }
      if(!this.employee.currency) {
        this.currency_log = "Please choose currency";
        employeeCount = 1;
      }
      if(!this.employee.employment_availability) {
        this.avail_log = "Please select employment availability";
        employeeCount = 1;
      }
    }

    if(this.contractorCheck) {

      if(!this.contractor.selectedLocation || (this.contractor.selectedLocation && this.contractor.selectedLocation.length <= 0) ) {
        this.contract_location_log = "Please select at least one location which you can work in without needing a visa";
        contractorCount = 1;
      }
      if(this.contractor.selectedLocation && this.contractor.selectedLocation.length > 0) {
        if(this.contractor.selectedLocation.filter(i => i.visa_needed === true).length === this.contractor.selectedLocation.length) {
          contractorCount = 1;
          this.contract_location_log = "Please select at least one location which you can work in without needing a visa";
        }
        this.validatedLocation=[];
        for(let location of this.contractor.selectedLocation) {
          if(location.name.includes('city')) {
            this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
          }
          if(location.name.includes('country')) {
            this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
          }
          if(location.name === 'Remote') {
            this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
          }

        }
        this.contractor.locations = this.validatedLocation;
      }

      if(this.contractor.selectedLocation && this.contractor.selectedLocation.length > 10) {
        this.contract_location_log = "Please select maximum 10 locations";
        contractorCount = 1;
      }

      if(!this.contractor.roles) {
        this.contractor_roles_log = "Please select minimum one role";
        contractorCount = 1;
      }

      if(!this.contractor.hourly_rate) {
        this.contractor_hourly_log = "Please enter hourly rate";
        contractorCount = 1;
      }
      if(!this.contractor.currency) {
        this.contractor_currency_log = "Please choose currency";
        contractorCount = 1;
      }
      if(!this.contractor.contractor_type) {
        this.contractor_type_log = "Please select minimum one contractor type";
        contractorCount = 1;
      }
      if(this.checkContractValue(this.contractor.contractor_type) && !this.contractor.agency_website) {
        this.agency_website_log = "Please enter agency website";
        contractorCount = 1;
      }
    }

    if(this.volunteerCheck) {

      if(!this.volunteer.selectedLocation || (this.volunteer.selectedLocation && this.volunteer.selectedLocation.length <= 0) ) {
        this.volunteer_location_log = "Please select at least one location which you can work in without needing a visa";
        volunteerCount = 1;
      }
      if(this.volunteer.selectedLocation && this.volunteer.selectedLocation.length > 0) {
        console.log(this.volunteer.selectedLocation);
        console.log(this.volunteer.selectedLocation.filter(i => i.visa_needed === true).length);
        if(this.volunteer.selectedLocation.filter(i => i.visa_needed === true).length === this.volunteer.selectedLocation.length) {
          volunteerCount = 1;
          this.volunteer_location_log = "Please select at least one location which you can work in without needing a visa";
        }
        this.validatedLocation=[];
        for(let location of this.volunteer.selectedLocation) {
          if(location.name.includes('city')) {
            this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
          }
          if(location.name.includes('country')) {
            this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
          }
          if(location.name === 'Remote') {
            this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
          }

        }
        this.volunteer.locations = this.validatedLocation;
      }
      if(!this.volunteer.roles || (this.volunteer.roles && this.volunteer.roles.length<=0)) {
        this.volunteer_roles_log = "Please select minimum one role";
        volunteerCount=1;
      }
      if(!this.volunteer.learning_objectives) {
        this.objective_log = "Please enter learning objectives";
        volunteerCount=1;
      }
    }


    if(this.current_salary && !this.current_currency ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(this.current_salary && this.current_currency === "-1" ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(!this.current_salary && this.current_currency !== "-1") {
      this.current_sal_log = "Please enter current base salary";
      this.count++;
    }

    if((!this.current_salary && !this.current_currency) || (!this.current_salary && this.current_currency === "-1")){
      this.count = 0;
    }

    if(!this.info.first_name)
    {
      this.first_name_log="Please enter first name";

    }
    if(!this.info.last_name)
    {
      this.last_name_log="Please enter last name";

    }
    if(!this.info.contact_number)
    {
      this.contact_name_log ="Please enter contact number";
    }

    if(!this.info.nationality )
    {
      this.nationality_log ="Please choose nationality";
    }

    if(!this.info.base_country )
    {
      this.base_country_log ="Please choose base country";
    }

    if(!this.info.city)
    {
      this.city_log ="Please enter base city";
    }


    if(!this.why_work)
    {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }

    if(this.commercially_worked.length !== this.commercial_expYear.length )
    {
      this.commercial_log = "Please fill year of experience";
    }

    if(this.LangexpYear.length !==  this.language.length)
    {

      this.exp_lang_log="Please fill year of experience";
    }
    if(!this.Intro)
    {

      this.intro_log="Please fill 2-5 sentence bio"
    }

    if(this.commercialSkills.length !== this.commercialSkillsExperienceYear.length)
    {
      this.commercial_skill_log = "Please fill year of experience";
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

          this.edu_count = parseInt(key) + 1;
        }

      }

    }
    if(this.ExperienceForm.value.ExpItems.length >=1)
    {
      this.exp_count =0;
      for (var key in this.ExperienceForm.value.ExpItems)
      {
        this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
        this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
        this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
        if(this.ExperienceForm.value.ExpItems[key].currentwork === true)
        {
          this.end_date_format = Date.now();
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
          this.start_date_log = "Please fill month";
        }

        if( !this.ExperienceForm.value.ExpItems[key].startyear)
        {
          this.start_date_year_log = "Please fill year";
        }

        if(!this.ExperienceForm.value.ExpItems[key].end_date && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_log = "Please fill month";
        }

        if(!this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_year_log = "Please fill year ";
        }

        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear && this.ExperienceForm.value.ExpItems[key].end_date &&
          this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork==false)
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


        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear &&  this.ExperienceForm.value.ExpItems[key].currentwork==true)
        {
          let dverified=0;
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            dverified=1;
          }
          if(dverified === 0) {
            this.exp_count = parseInt(key) + 1;
          }

          this.ExperienceForm.value.ExpItems[key].enddate = new Date();

        }

      }

    }

    console.log(this.count);
    console.log((this.employeeCheck || this.contractorCheck || this.volunteerCheck))
    console.log(employeeCount);
    console.log(contractorCount);
    console.log(volunteerCount);

    if(this.count === 0 && (this.employeeCheck || this.contractorCheck || this.volunteerCheck)
      && employeeCount === 0 && contractorCount === 0 && volunteerCount === 0 && this.info.first_name && this.info.last_name && this.info.contact_number && this.info.nationality &&
      this.info.city && this.info.base_country &&
      this.why_work && this.commercially_worked.length === this.commercial_expYear.length &&
      this.language &&this.LangexpYear.length ===  this.language.length && this.Intro && this.edu_count === this.EducationForm.value.itemRows.length && this.exp_count === this.ExperienceForm.value.ExpItems.length
      && this.commercialSkills.length === this.commercialSkillsExperienceYear.length
    )
    {
      this.verify = true;
    }
    else {
      this.verify = false;
    }
    if(this.verify === true ) {
      if(typeof(this.expected_salaryyy) === 'string' )
        profileForm.value.expected_salary = parseInt(this.expected_salaryyy);
      if(this.salary && typeof (this.salary) === 'string') {
        profileForm.value.salary = parseInt(this.salary);

      }

      this.updateProfileData(profileForm.value);
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }

  }

  file_size=1048576;
  image_log;
  dateValidation;
  submit;
  updateProfileData(profileForm)
  {
    this.experiencearray=[];
    this.education_json_array=[];
    this.submit = 'click';
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (fileCount > 0 )
    {

      if(inputEl.files.item(0).size < this.file_size)
      {
        formData.append('image', inputEl.files.item(0));
        this.authenticationService.edit_candidate_profile(this.currentUser._id , formData, false)
          .subscribe(
            data => {
              if (data) {
                //console.log(data);
                //this.router.navigate(['/candidate_profile']);
              }
            },
            error => {
              if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
            }
          );
      }
      else
      {
        this.image_log = "Image size should be less than 1MB";
      }
    }
    for (var key in this.ExperienceForm.value.ExpItems)
    {
      this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
      this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
      this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
      this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);
      if(this.ExperienceForm.value.ExpItems[key].currentwork == true )
      {
        this.end_date_format = new Date();
      }
      else
      {
        this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);

      }
      this.experiencejson = {companyname : this.ExperienceForm.value.ExpItems[key].companyname , positionname : this.ExperienceForm.value.ExpItems[key].positionname,locationname : this.ExperienceForm.value.ExpItems[key].locationname,description : this.ExperienceForm.value.ExpItems[key].description,startdate : this.start_date_format,enddate : this.end_date_format , currentwork : this.ExperienceForm.value.ExpItems[key].currentwork};
      this.experiencearray.push(this.experiencejson);
    }

    for ( var key in this.EducationForm.value.itemRows)
    {
      this.EducationForm.value.itemRows[key].eduyear =  parseInt(this.EducationForm.value.itemRows[key].eduyear);
      this.educationjson = {uniname : this.EducationForm.value.itemRows[key].uniname , degreename :  this.EducationForm.value.itemRows[key].degreename
        ,fieldname : this.EducationForm.value.itemRows[key].fieldname , eduyear : this.EducationForm.value.itemRows[key].eduyear  };
      this.education_json_array.push(this.educationjson) ;
    }

    if(this.commercially_worked.length === 0) {
      profileForm.commercial_platforms = [];
    }
    else {
      profileForm.commercial_platforms = this.commercial_expYear;
    }

    if(this.commercialSkills.length === 0) {
      profileForm.commercial_skills = [];
    }
    else {
      profileForm.commercial_skills = this.commercialSkillsExperienceYear;
    }

    profileForm.description_commercial_platforms = '';
    if(this.description_commercial_platforms){
      profileForm.description_commercial_platforms = this.description_commercial_platforms;
    }

    profileForm.description_experimented_platforms = '';
    if(this.description_experimented_platforms){
      profileForm.description_experimented_platforms = this.description_experimented_platforms;
    }

    profileForm.description_commercial_skills = '';
    if(this.description_commercial_skills){
      profileForm.description_commercial_skills = this.description_commercial_skills;
    }

    if(this.language.length === 0) {
      profileForm.language = [];
    }
    else {
      profileForm.language_experience_year = this.LangexpYear;
    }

    let inputQuery:any ={};

    if(this.info.first_name) inputQuery.first_name = this.info.first_name;
    if(this.info.last_name) inputQuery.last_name = this.info.last_name;
    if(this.info.contact_number) inputQuery.contact_number = this.info.contact_number;
    if(this.info.github_account) inputQuery.github_account = this.info.github_account;
    if(this.info.exchange_account) inputQuery.exchange_account = this.info.exchange_account;
    if(this.info.linkedin_account) inputQuery.linkedin_account = this.info.linkedin_account;
    if(this.info.medium_account) inputQuery.medium_account = this.info.medium_account;
    if(this.info.nationality) inputQuery.nationality = this.info.nationality;
    if(this.info.Intro) inputQuery.description = this.info.Intro;
    if(this.info.base_country) inputQuery.base_country = this.info.base_country;
    if(this.info.city) inputQuery.base_city = this.info.city;
    if(this.why_work) inputQuery.why_work = this.why_work;
    if(profileForm.commercial_platforms) inputQuery.commercial_platforms = profileForm.commercial_platforms;
    if(profileForm.description_commercial_platforms) inputQuery.description_commercial_platforms = profileForm.description_commercial_platforms;
    if(this.experimented_platform) inputQuery.experimented_platforms = this.experimented_platform;
    if(profileForm.description_experimented_platforms) inputQuery.description_experimented_platforms = profileForm.description_experimented_platforms;
    if(profileForm.commercial_skills) inputQuery.commercial_skills = profileForm.commercial_skills;
    if(profileForm.description_commercial_skills) inputQuery.description_commercial_skills = profileForm.description_commercial_skills;
    if(profileForm.language_experience_year) inputQuery.programming_languages = profileForm.language_experience_year;
    if(this.education_json_array) inputQuery.education_history = this.education_json_array;
    if(this.experiencearray) inputQuery.work_history = this.experiencearray;
    if(this.employeeCheck) {
      inputQuery.employee = {
        employment_type : this.employee.employment_type,
        expected_annual_salary: parseInt(this.employee.expected_annual_salary),
        currency: this.employee.currency,
        location: this.employee.selectedLocation,
        roles: this.employee.roles,
        employment_availability: this.employee.employment_availability
      }
    }

    if(this.contractorCheck) {
      inputQuery.contractor = {
        expected_hourly_rate : parseInt(this.contractor.hourly_rate),
        currency: this.contractor.currency,
        location: this.contractor.selectedLocation,
        roles: this.contractor.roles,
        contractor_type: this.contractor.contractor_type,
        service_description : this.contractor.service_description
      }
      if(this.contractor.agency_website) inputQuery.contractor.agency_website = this.contractor.agency_website;
      if(this.contractor.max_hour_per_week) inputQuery.contractor.max_hour_per_week = parseInt(this.contractor.max_hour_per_week);
    }

    if(this.volunteerCheck) {
      inputQuery.volunteer = {
        location: this.volunteer.selectedLocation,
        roles: this.volunteer.roles,
        max_hours_per_week: parseInt(this.volunteer.max_hours_per_week),
        learning_objectives : this.volunteer.learning_objectives
      }
    }
    if(this.current_salary) inputQuery.current_salary = parseInt(this.current_salary);
    if(this.current_currency) inputQuery.current_currency = this.current_currency;
    this.authenticationService.edit_candidate_profile(this.currentUser._id, inputQuery, false)
      .subscribe(
        data => {
          if(data && this.currentUser)
          {
            this.router.navigate(['/candidate_profile']);

          }

        },
        error => {
          this.dataservice.changeMessage(error);
          this.log = 'Something getting wrong';
          if(error.message === 500)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }

        });


  }
  endDateYear() {
    this.dateValidation = "";
  }
  commercialSkills=[];
  commercialSkillsExperienceYear=[];

  oncommercialSkillsOptions(obj)
  {

    let updateItem = this.commercialSkills.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.commercialSkills.indexOf(updateItem);
    if(index > -1)
    {
      this.commercialSkills.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill',  obj.value);
      let index2 = this.commercialSkillsExperienceYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercialSkillsExperienceYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercialSkills.push(obj);
    }


  }

  onComSkillExpYearOptions(e, value)
  {
    let updateItem = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill', value);
    let index = this.commercialSkillsExperienceYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercialSkillsExperienceYear.splice(index, 1);
      this.value = value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    this.commercialSkillsExperienceYear.sort(function(a, b){
      if(a.skill < b.skill) { return -1; }
      if(a.skill > b.skill) { return 1; }
      return 0;
    })
  }

  verify;
  checkDateVerification(month,year) {
    if(month && year) {
      this.startmonthIndex = this.monthNameToNum(month);
      this.start_date_format  = new Date(year, this.startmonthIndex);
      if(this.start_date_format > new Date()) {
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

  checkValidation(value) {
    if(value.filter(i => i.visa_needed === true).length === value.length) return true;
    else return false;
  }

  checkContractValue(array) {
    if(array && array.indexOf('agency') === 0) return true;
    else return false;
  }

  suggestedOptions(inputParam) {
    console.log(inputParam);
    if(inputParam !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(inputParam , true)
        .subscribe(
          data => {
            if(data) {
              let citiesInput = data;
              let citiesOptions=[];
              for(let cities of citiesInput['locations']) {
                if(cities['remote'] === true) {
                  citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country + " (city)";
                  citiesOptions.push({_id : cities['city']._id , name : cityString});
                }
                if(cities['country'] ) {
                  let countryString = cities['country']  + " (country)";
                  if(citiesOptions.findIndex((obj => obj.name === countryString)) === -1)
                    citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: countryString});
                }
              }
              this.cities = this.filter_array(citiesOptions);

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
    }
    return this.cities;
  }

  updateCitiesOptions(input, check,array) {
    let objIndex = array.findIndex((obj => obj.name === input));
    array[objIndex].visa_needed = check;
    return array;

  }

  deleteLocationRow(array, index){
    array.splice(index, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  workTypeChange(event) {

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 300);
    if(event.target.checked)
    {
      this.selected_work_type.push(event.target.value);
    }
    else{
      let updateItem = this.selected_work_type.find(x => x === event.target.value);
      let index = this.selected_work_type.indexOf(updateItem);
      this.selected_work_type.splice(index, 1);
    }

    console.log(this.selected_work_type);

    if(this.selected_work_type.indexOf('employee') > -1) this.employeeCheck = true;
    else this.employeeCheck = false;
    if(this.selected_work_type.indexOf('contractor') > -1) this.contractorCheck = true;
    else this.contractorCheck = false;
    if(this.selected_work_type.indexOf('volunteer') > -1) this.volunteerCheck = true;
    else this.volunteerCheck = false;
  }

  employeeSelectedValueFunction(e) {
    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+this.employee.country+"']")['dataset'].value;

        this.employee.country = '';
        this.cities = [];
        if(this.selectedValueArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.selectedValueArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.selectedValueArray.push({_id:value2send ,  name: e, visa_needed:false});
            else this.selectedValueArray.push({ name: e, visa_needed:false});
          }


        }


      }
      if(this.selectedValueArray.length > 0) {
        this.selectedValueArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
          let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
          this.selectedValueArray.splice(0, 0, remoteValue);
          this.selectedValueArray = this.filter_array(this.selectedValueArray);

        }
        this.employee.selectedLocation = this.selectedValueArray;
      }
    }

  }
  employeeUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.employee.selectedLocation );

  }
  employeeDeleteLocationRow(index){
    this.deleteLocationRow(this.employee.selectedLocation, index);
  }

  contractorSelectedValueFunction(e) {
    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+this.contractor.country+"']")['dataset'].value;

        this.contractor.country = '';
        this.cities = [];
        if(this.contractorArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.contractorArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.contractorArray.push({_id:value2send ,  name: e, visa_needed:false});
            else this.contractorArray.push({ name: e, visa_needed:false});
          }


        }


      }
      if(this.contractorArray.length > 0) {
        this.contractorArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        if(this.contractorArray.find((obj => obj.name === 'Remote'))) {
          let remoteValue = this.contractorArray.find((obj => obj.name === 'Remote'));
          this.contractorArray.splice(0, 0, remoteValue);
          this.contractorArray = this.filter_array(this.contractorArray);

        }
        this.contractor.selectedLocation = this.contractorArray;
      }
    }

  }
  contractorUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.contractor.selectedLocation );

  }
  contractorDeleteLocationRow(index){
    this.deleteLocationRow(this.contractor.selectedLocation, index);
  }

  volunteerSelectedValueFunction(e) {
    console.log("volunteerArray");
    console.log(this.volunteerArray);
    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+this.volunteer.country+"']")['dataset'].value;

        this.volunteer.country = '';
        this.cities = [];
        if(this.volunteerArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.volunteerArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.volunteerArray.push({_id:value2send ,  name: e, visa_needed:false});
            else this.volunteerArray.push({ name: e, visa_needed:false});
          }


        }


      }
      if(this.volunteerArray.length > 0) {
        this.volunteerArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        if(this.volunteerArray.find((obj => obj.name === 'Remote'))) {
          let remoteValue = this.volunteerArray.find((obj => obj.name === 'Remote'));
          this.volunteerArray.splice(0, 0, remoteValue);
          this.volunteerArray = this.filter_array(this.volunteerArray);

        }
        this.volunteer.selectedLocation = this.volunteerArray;
      }
    }

  }
  volunteerUpdateCitiesOptions(event) {
    this.updateCitiesOptions(event.target.value ,event.target.checked, this.volunteer.selectedLocation );

  }
  volunteerDeleteLocationRow(index){
    this.deleteLocationRow(this.volunteer.selectedLocation, index);
  }

  populateRoles(value, array) {
    if(array && array.find((obj => obj === value))) return true;
    else false
  }

  onJobSelected(e, type) {
    console.log(type);
    this.jobselected = [];
    if(type === 'employee') {
      if(this.employee.roles) this.jobselected = this.employee.roles;
    }
    if(type === 'contractor') {
      if(this.contractor.roles) this.jobselected = this.contractor.roles;

    }
    if(type === 'volunteer') {
      if(this.volunteer.roles) this.jobselected = this.volunteer.roles;

    }
    if(e.target.checked) {
      this.jobselected.push(e.target.value);
    }
    else {
      let updateItem = this.jobselected.find(this.findIndexToUpdate, e.target.value);
      let index = this.jobselected.indexOf(updateItem);
      this.jobselected.splice(index, 1);
    }
    if(type === 'employee') {
      this.employee.roles=  this.jobselected;
    }
    if(type === 'contractor') {
      this.contractor.roles=  this.jobselected;
    }
    if(type === 'volunteer') {
      this.volunteer.roles=  this.jobselected;
    }

  }

  contractor_type(inputParam) {
    if(inputParam.target.checked) {
      this.contract_type.push(inputParam.target.value);
    }
    else {
      let updateItem = this.contract_type.find(this.findIndexToUpdate, inputParam.target.value);
      let index = this.contract_type.indexOf(updateItem);
      this.contract_type.splice(index, 1);
    }
    this.contractor.contractor_type = this.contract_type;
    this.checkContractValue(this.contractor.contractor_type);
  }

}
