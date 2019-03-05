import { Component, OnInit, ElementRef , AfterViewInit , AfterViewChecked} from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import {NgForm , FormGroup , FormBuilder, FormArray} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

declare var $:any;

import {environment} from '../../../environments/environment';
const URL = environment.backend_url;


@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css']
})
export class EditCompanyProfileComponent implements OnInit , AfterViewInit, AfterViewChecked  {

  info : any;
  currentUser: User;
  log;
  founded_log;
  employee_log;
  funded_log;
  des_log;
  image_src;
  company_founded;
  no_of_employees;
  company_funded;
  company_description;
  last_name;
  first_name;
  job_title;
  company_website;
  company_name;
  company_phone;
  company_country;
  company_city;
  company_postcode;
  image;
  img_data;
  img_src;
  email;
  file_size = 1048576;
  company_postcode_log;
  first_name_log;
  last_name_log;
  job_title_log;
  company_name_log;
  company_website_log;
  company_phone_log;
  company_country_log;
  company_city_log;
  image_log;
  preferncesForm : FormGroup;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  current_currency_log;
  email_notification_log;
  error_msg;
  about_active_class;
  companyMsgTitle;
  current_salary;
  index;
  other_technologies;
  avail_day;
  expected_validation;
  currentyear;
  yearValidation;
  cities;
  selectedValueArray=[];
  error;
  selectedLocations;
  emptyInput;
  when_receive_email_notitfications;
  yearVerification;

  countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

  locations = [
    {country_code:'000' , name:'Remote', value:'remote', checked:false},
    {country_code:'001' ,name:'Paris', value:'Paris', checked:false},
    {country_code:'001' ,name:'London', value:'London', checked:false},
    {country_code: '001' ,name:'Dublin', value:'Dublin', checked:false},
    {country_code: '001' ,name:'Amsterdam', value:'Amsterdam', checked:false},
    {country_code: '001' ,name:'Berlin', value:'Berlin', checked:false},
    {country_code: '001' ,name:'Barcelona', value:'Barcelona', checked:false},
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
    {country_code: '004' ,name:'Toronto', value:'Toronto', checked:false},
    {country_code: '004' ,name:'Sydney', value:'Sydney', checked:false},
  ];

  job_types = ['Full time' , 'Part time' , 'Freelance' ];

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
  ];

  currency = ["Currency", "£ GBP" ,"€ EUR" , "$ USD"];

  blockchain = [
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
    {name:'Dash', value:'Dash', checked:false},
    {name:'Doge', value:'Doge', checked:false},
  ];

  language_opt= [
    {name:'Java', value:'Java', checked:false},
    {name:'C', value:'C', checked:false},
    {name:'C++', value:'C++', checked:false},
    {name:'C#', value:'C#', checked:false},
    {name:'Python', value:'Python', checked:false},
    {name:'Visual Basic .NET', value:'Visual Basic .NET', checked:false},
    {name:'PHP', value:'PHP', checked:false},
    {name:'JavaScript', value:'JavaScript', checked:false},
    {name:'Delphi/Object Pascal', value:'Delphi/Object Pascal', checked:false},
    {name:'Swift', value:'Swift', checked:false},
    {name:'Perl', value:'Perl', checked:false},
    {name:'Ruby', value:'Ruby', checked:false},
    {name:'Assembly language', value:'Assembly language', checked:false},
    {name:'R', value:'R', checked:false},
    {name:'Visual Basic', value:'Visual Basic', checked:false},
    {name:'Objective-C', value:'Objective-C', checked:false},
    {name:'Go', value:'Go', checked:false},
    {name:'MATLAB', value:'MATLAB', checked:false},
    {name:'PL/SQL', value:'PL/SQL', checked:false},
    {name:'Scratch', value:'Scratch', checked:false},
    {name:'Solidity', value:'Solidity', checked:false},
    {name:'Serpent', value:'Serpent', checked:false},
    {name:'LLL', value:'LLL', checked:false},
    {name:'Nodejs', value:'Nodejs', checked:false},
    {name:'Scala', value:'Scala', checked:false},
    {name:'Rust', value:'Rust', checked:false},
    {name:'Kotlin', value:'Kotlin', checked:false},
    {name:'Haskell', value:'Haskell', checked:false},

  ];

  email_notificaiton = ['Never' , 'Daily' , '3 days' , 'Weekly'];

  residenceCountries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
  prefData;

  constructor(private _fb: FormBuilder ,private datePipe: DatePipe,
              private router: Router,private authenticationService: UserService,private dataservice: DataService,private el: ElementRef) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 500);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }

  ngAfterViewChecked() {

  }

  initPrefRows()
  {
    return this._fb.group({
      _id :[],
      location: [''],
      name: [''],
      visa_needed : [false],
      job_type: [''],
      position: [''],
      current_currency: [''],
      current_salary: [''],
      blockchain: [''],
      skills: [''],
      other_technologies: [''],
      order_preferences: [''],
      residence_country: [''],
      timestamp:[]
    });
  }

  private preferncesFormData(): FormGroup[]
  {
    return this.prefData
      .map(i => this._fb.group({ timestamp:i.timestamp,_id: i._id, residence_country: [i.residence_country], name: i.name, location: this.selectedCompanyLocation(i.location) , visa_needed : i.visa_needed, job_type: [i.job_type], position: [i.position], current_currency: i.current_currency, current_salary: i.current_salary, blockchain: [i.blockchain], skills: [i.skills], other_technologies: i.other_technologies, order_preferences: [i.order_preferences] } ));
  }

  selectedCompanyLocation(location) {
    this.selectedValueArray=[];
    if(location && location.length > 0) {
      for (let country1 of location)
      {
        if (country1['remote'] === true) {
          this.selectedValueArray.push({_id:country1['_id'] ,name: 'Remote' });
        }

        if (country1['city']) {
          let city = country1['city'].city + ", " + country1['city'].country;
          this.selectedValueArray.push({_id:country1['_id'] ,city:country1['city']._id ,name: city });
        }
      }

      this.selectedValueArray.sort();
      if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
        let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
        this.selectedValueArray.splice(0, 0, remoteValue);
        this.selectedValueArray = this.filter_array(this.selectedValueArray);
      }
      this.locationArray.push(this.selectedValueArray);
      return '';
    }
    else {
      this.locationArray.push([]);
      return '';
    }
  }

  deletePrefRow(index: number)
  {
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.removeAt(index);
  }

  locationArray = [];
  ngOnInit()
  {
    this.prefData=[];
    this.company_country=-1;
    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type === 'company')
    {
      this.locations.sort(function(a, b){
        if(b.name === 'Remote' || a.name === 'Remote') {
        }
        else {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        }
      })

      this.job_types.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
      })

      this.roles.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.blockchain.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.preferncesForm = this._fb.group({
        prefItems: this._fb.array([this.initPrefRows()])
      });
      this.authenticationService.getCurrentCompany(this.currentUser._creator)
        .subscribe(
          data =>
          {
            if(data)
            {
              this.email = data['_creator'].email;
              this.when_receive_email_notitfications = data['when_receive_email_notitfications'];
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.company_founded = data['company_founded'];
              this.no_of_employees = data['no_of_employees'];
              this.company_funded = data['company_funded'];
              this.company_description = data['company_description'];
              if(data['company_logo'] != null) {

                this.img_data = data['company_logo'];

                let x = this.img_data.split("/");

                let last: any = x[x.length - 1];

                this.img_src = last;

              }

            }

            if(data['first_name'] && data['last_name'] && data['job_title'] && data['company_name'] && data['company_website'] &&
              data['company_phone'] && data['company_postcode'])
            {
              this.first_name= data['first_name'];
              this.last_name=data['last_name'];
              this.job_title =data['job_title'];
              this.company_name=data['company_name'];
              this.company_website=data['company_website'];
              this.company_phone=data['company_phone'];
              this.company_country=data['company_country'];
              this.company_city =data['company_city'];
              this.company_postcode = data['company_postcode'];

            }

            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              setTimeout(() => {
                $('.selectpicker').selectpicker();
                $('.selectpicker').selectpicker('refresh');
              }, 500);
              this.prefData = data['saved_searches'];
              this.preferncesForm = this._fb.group({
                prefItems: this._fb.array(
                  this.preferncesFormData()
                )
              });

            }
          },
          error =>
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

            if(error['message'] === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
    else
    {

      this.router.navigate(['/not_found']);

    }

  }
  validatedLocation;
  country_input_log;
  country_log;
  search_log;
  search_name_log;
  residence_log;
  company_profile(profileForm: NgForm)
  {
    this.error_msg = "";
    if(this.company_founded){
      this.company_founded = parseInt(this.company_founded);
    }
    if(!this.first_name) {
      this.first_name_log="Please enter first name";
    }
    if(!this.last_name) {
      this.last_name_log="Please enter first name";
    }
    if(!this.job_title) {
      this.job_title_log="Please enter first name";
    }
    if(!this.company_name) {
      this.company_name_log="Please enter first name";
    }
    if(!this.company_website) {
      this.company_website_log="Please enter first name";
    }
    if(!this.company_phone) {
      this.company_phone_log="Please enter first name";
    }
    if(this.company_country === -1) {
      this.company_country_log="Please enter company name";
    }
    if(!this.company_city) {
      this.company_city_log="Please enter city name";
    }
    if(!this.company_postcode) {
      this.company_postcode_log="Please enter post code";
    }
    if(!this.company_founded) {
      this.founded_log = 'Please fill when was the company founded';
    }
    if(this.company_founded >  this.currentyear ) {
      this.yearValidation = "Date must be in the past"
    }

    if(this.company_founded < 1800) {
      this.yearValidation = "Please enter value greater than 1800";
    }

    if(!this.no_of_employees) {
      this.employee_log = 'Please fill no. of employees';
    }
    if(!this.company_funded) {
      this.funded_log = 'Please fill how is the company funded';
    }
    if(!this.company_description) {
      this.des_log = 'Please fill Company Description';
    }

    if(this.selectedLocations && this.selectedLocations.length > 10) {
      this.country_log = "Please select maximum 10 locations";
    }

    if(!this.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
    }

    let count = 0;
    if(this.preferncesForm.value.prefItems.length > 0) {
      for(let i=0 ; i<this.preferncesForm.value.prefItems.length; i++) {
        if(!this.preferncesForm.value.prefItems[i].name) {
          this.search_name_log = 'Please enter search name';
          count = 1;

        }
        else if(!this.preferncesForm.value.prefItems[i].job_type && !this.preferncesForm.value.prefItems[i].position && !this.locationArray[i] &&
          !this.preferncesForm.value.prefItems[i].blockchain && !this.preferncesForm.value.prefItems[i].visa_needed &&
          !this.preferncesForm.value.prefItems[i].skills && !this.preferncesForm.value.prefItems[i].residence_country &&
          !this.preferncesForm.value.prefItems[i].current_salary && !this.preferncesForm.value.prefItems[i].current_currency &&
          !this.preferncesForm.value.prefItems[i].other_technologies && !this.preferncesForm.value.prefItems[i].order_preferences) {
          this.search_log = 'Please fill atleast one field in job search';
          count = 1;
        }
        else if(this.preferncesForm.value.prefItems[i].residence_country && this.preferncesForm.value.prefItems[i].residence_country.length > 50) {
          this.residence_log = "Please select maximum 50 countries";
        }
        else {

        }
      }
    }

    if(count === 0 &&this.company_founded && this.company_founded > 1800 && this.company_founded <=  this.currentyear && this.no_of_employees
      && this.company_funded && this.company_description && this.when_receive_email_notitfications &&
      this.first_name && this.last_name && this.job_title && this.company_name && this.company_website &&
      this.company_phone && this.company_country !== -1 && this.company_city && this.company_postcode )  {
      profileForm.value.company_founded = parseInt(profileForm.value.company_founded);
      let formData = new FormData();
      let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#profile');
      if (inputEl && inputEl.files && inputEl.files.length > 0)
      {
        if(inputEl.files.item(0).size < this.file_size)
        {
          formData.append('company_logo', inputEl.files.item(0));
          this.authenticationService.edit_company_profile(formData)
            .subscribe(
              data => {
                if(data && this.currentUser)
                {
                  //this.router.navigate(['/company_profile']);
                }

              },
              error => {
                if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                  this.dataservice.changeMessage(error['error']['message']);
                }
                else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                  this.dataservice.changeMessage(error['error']['message']);
                }
                else {
                  this.dataservice.changeMessage("Something getting wrong");
                }

              });


        }
        else
        {
          this.image_log = "Image size should be less than 1MB";
        }

      }

      let saved_searches = [];
      if(this.preferncesForm.value.prefItems && this.preferncesForm.value.prefItems.length > 0){
        let i=0;
        for(let key of this.preferncesForm.value.prefItems) {
          let searchQuery : any = {};
          let validLocation = [];

          if(key['visa_needed']) searchQuery.visa_needed = key['visa_needed'];
          else searchQuery.visa_needed = false;
          if(key['job_type']) searchQuery.job_type = key['job_type'];
          if(key['position']) searchQuery.position = key['position'];
          if(key['blockchain']) searchQuery.blockchain = key['blockchain'];
          if(key['skills']) searchQuery.skills = key['skills'];
          if(key['residence_country']) searchQuery.residence_country = key['residence_country'];
          if(key['order_preferences']) searchQuery.order_preferences = key['order_preferences'];
          if(key['_id']) searchQuery._id = key['_id'];

          if(i < this.preferncesForm.value.prefItems.length) {
            if(this.locationArray[i]) {
              for(let location of this.locationArray[i]) {
                if(location.name.includes(', ')) {
                  validLocation.push({_id:location._id,  city: location.city, visa_needed : location.visa_needed });
                }
                if(location.name === 'Remote') {
                  validLocation.push({_id:location._id, remote: true, visa_needed : location.visa_needed });
                }

              }
              searchQuery.location = validLocation;

            }

          }
          if(key['name']) searchQuery.name = key['name'];

          if(key['current_currency'] !== 'Currency' && key['current_salary']) {
            searchQuery.current_currency = key['current_currency'];
            searchQuery.current_salary = Number(key['current_salary']);
          }
          if(key['other_technologies']) searchQuery.other_technologies = key['other_technologies'];
          saved_searches.push(searchQuery);
          if(key['timestamp']) searchQuery.timestamp = key['timestamp'];

          i++;
        }
      }
      profileForm.value.saved_searches = saved_searches;

      this.authenticationService.edit_company_profile(profileForm.value)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/company_profile']);
            }

          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.dataservice.changeMessage(error['error']['message']);
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.dataservice.changeMessage(error['error']['message']);
            }
            else {
              this.dataservice.changeMessage("Something getting wrong");
            }

          });
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

  suggestedOptions(index) {
    if(this.preferncesForm.value.prefItems[index].location !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(this.preferncesForm.value.prefItems[index].location , true)
        .subscribe(
          data => {
            if(data) {
              let citiesInput = data;
              let citiesOptions=[];
              for(let cities of citiesInput['locations']) {
                if(cities['remote'] === true) {
                  citiesOptions.push({name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country;
                  citiesOptions.push({city : cities['city']._id , name : cityString});
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


  }


  selectedValueFunction(locValue, index) {
    if(this.cities) {
      if(this.cities.find(x => x.name === locValue)) {
        var value2send=document.querySelector("#countryList option[value='"+ locValue +"']")['dataset'].value;
        ((this.preferncesForm.get('prefItems') as FormArray).at(index) as FormGroup).get('location').patchValue('');
        this.cities = [];
        if(!this.locationArray[index]) this.locationArray[index] = [];
        if(this.locationArray[index].length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.locationArray[index].find(x => x.name === locValue)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.locationArray[index].push({city:value2send ,  name: locValue, visa_needed:false});
            else this.locationArray[index].push({ name: locValue, visa_needed:false});
          }
        }

        if(this.locationArray[index].length > 0) {
          this.locationArray[index].sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          })
          if(this.locationArray[index].find((obj => obj.name === 'Remote'))) {
            let remoteValue = this.locationArray[index].find((obj => obj.name === 'Remote'));
            this.locationArray[index].splice(0, 0, remoteValue);
            this.locationArray[index] = this.filter_array(this.locationArray[index]);

          }
        }
      }
    }

  }


  deleteLocationRow(locationIndex, index){
    this.locationArray[index].splice(locationIndex, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  checkNumber(salary) {
    if(!Number(this.preferncesForm.value.current_salary)) {
      return true;
    }
    else {
      return false;
    }

  }

  get DynamicWorkFormControls()
  {
    return <FormArray>this['preferncesForm'].get('prefItems');
  }

  addNewSearch()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.push(this.initPrefRows());
  }

}
