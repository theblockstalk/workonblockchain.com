import { Component, OnInit,AfterViewInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
declare var $:any;

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit,AfterViewInit {

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService) { }
  info: any = {};
  country ='';
  roles='';
  interest_area='';
  expected_salary='';
  checked_country='';
  selectedValue = [];
  selectedcountry = [];
  expYear=[];
  interest='';
  optionSelected: any;
  jobselected=[];
  position='';
  experience_year='';
  currentUser: User;exp_class;
  log; salary; available;link;class;
  availability_day;availability_year;
  active_class;
  job_active_class;
  exp_active_class;resume_active_class;resume_class;base_currency;
  about_active_class;
  term_active_class;
  term_link;
  resume_disable;
  exp_disable;
  current_currency;
  current_salary;
  error_msg;
  expected_validation;
  selectedValueArray=[];
  countriesModel;
  error;
  selectedLocations;
  cities;
  country_log;
  roles_log;
  currency_log;
  salary_log;
  interest_log;
  avail_log;
  current_sal_log;
  current_currency_log;
  count;
  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
  }
  ngOnInit()
  {
    this.resume_disable = "disabled";
    this.exp_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/signup']);
    }
    if(this.currentUser && this.currentUser.type === 'candidate')
    {
      this.options.sort(function(a, b){
        if(b.name === 'Remote' || a.name === 'Remote') {
        }
        else {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        }
      })

      this.dropdown_options.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.area_interested.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.class="btn disabled";
      this.exp_class="btn disabled";
      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data => {
            this.selectedValueArray.push({name:'Afghanistan (city)' , visa_not_needed : true} , {name:'Albania (country)' , visa_not_needed : false} )
            this.selectedLocations = this.selectedValueArray;

            if(data['contact_number']  && data['nationality'] && data['first_name'] && data['last_name'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }

            if(data['candidate'].locations || data['candidate'].roles || data['candidate'].interest_areas ||  data['candidate'].expected_salary || data['candidate'].availability_day || data['candidate'].expected_salary_currency)
            {
              if(data['candidate'].locations)
              {
                for (let country1 of data['candidate'].locations)
                {

                  for(let option of this.options)
                  {

                    if(option.value === country1)
                    {
                      option.checked=true;
                      this.selectedcountry.push(country1);

                    }

                  }

                }
              }


              if(data['candidate'].interest_areas)
              {
                for (let interest of data['candidate'].interest_areas)
                {

                  for(let option of this.area_interested)
                  {

                    if(option.value === interest)
                    {
                      option.checked=true;
                      this.selectedValue.push(interest);

                    }

                  }

                }
              }
              if(data['candidate'].roles)
              {
                for (let area of data['candidate'].roles)
                {

                  for(let option of this.dropdown_options)
                  {
                    if(option.value === area)
                    {
                      option.checked=true;
                      this.jobselected.push(area);

                    }

                  }

                }
              }

              this.salary = data['candidate'].expected_salary;
              this.availability_day = data['candidate'].availability_day;
              if(data['candidate'].expected_salary_currency)
                this.base_currency = data['candidate'].expected_salary_currency;
              if(data['candidate'].current_currency && data['candidate'].current_salary)
                this.current_currency =data['candidate'].current_currency;
              this.current_salary = data['candidate'].current_salary;


              if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas && data['candidate'].expected_salary && data['candidate'].availability_day)
              {
                this.active_class = 'fa fa-check-circle text-success';
                this.class = "btn";
                this.job_active_class = 'fa fa-check-circle text-success';
                this.resume_disable ='';
                this.resume_class="/resume";

              }

              if(data['candidate'].why_work)
              {
                this.exp_disable ='';
                this.resume_active_class='fa fa-check-circle text-success';
                this.exp_class = "/experience";
              }



              if(data['candidate'].description )
              {
                this.exp_class = "/experience";
                this.exp_active_class = 'fa fa-check-circle text-success';
              }

            }



          },
          error => {
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
      {name:'Researcher', value:'Researcher', checked:false},
      {name:'Mobile app developer', value:'Mobile app developer', checked:false},
      {name:'Data scientist', value:'Data scientist', checked:false},
      {name:'Security specialist ', value:'Security specialist', checked:false},
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
      "2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009","2008","2007","2006","2005","2004","2003","2002","2001","2000","1999","1998","1997","1996","1995","1994","1993","1992","1991"
    ]
  month= ["Now","1 month","2 months","3 months","Longer than 3 months"]


  onAreaSelected(e)
  {
    if(e.target.checked)
    {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(this.findIndexToUpdate, e.target.value);
      let index = this.selectedValue.indexOf(updateItem);
      this.selectedValue.splice(index, 1);
    }

  }

  onJobSelected(e)
  {
    if(e.target.checked)
    {
      this.jobselected.push(e.target.value);
    }
    else{
      let updateItem = this.jobselected.find(this.findIndexToUpdate, e.target.value);
      let index = this.jobselected.indexOf(updateItem);
      this.jobselected.splice(index, 1);
    }

  }



  findIndexToUpdate(type) {
    return type == this;
  }

  onExperienceChange(event)
  {
    this.experience_year=event.target.value;
    this.expYear.push(event.target.value);
  }



  checkValidation(value) {
    return value.filter(i => i.visa_not_needed === true).length;
  }

  validatedLocation=[];
  onSubmit(f: NgForm)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.error_msg = "";
    this.count = 0;

    if(!this.selectedLocations) {
      this.country_log = "Please select at least one location which you can work in without needing a visa";
    }

    if(this.selectedLocations && this.selectedLocations.length > 0) {
      if(this.selectedLocations.filter(i => i.visa_not_needed === true).length <= 0 )
        this.country_log = "Please select at least one location which you can work in without needing a visa";

      for(let location of this.selectedLocations) {
        if(location.name.includes('city')){
          this.validatedLocation.push({city: location.name, visa_not_needed : location.visa_not_needed });
        }
        if(location.name.includes('country')){
          this.validatedLocation.push({country: location.name, visa_not_needed : location.visa_not_needed });
        }
      }
    }

    if(this.selectedLocations && this.selectedLocations.length > 10) {
      this.country_log = "Please select maximum 10 locations";
    }


    if(this.selectedcountry.length <=0)
    {
      this.country_log = "Please select at least one location";
    }

    if(this.jobselected.length<=0)
    {
      this.roles_log = "Please select at least one role";
    }

    if(!this.base_currency)
    {
      this.currency_log = "Please choose currency";
    }

    if(!this.salary)
    {
      this.salary_log = "Please enter expected yearly salary";
    }

    if(this.selectedValue.length<=0)
    {
      this.interest_log = "Please select at least one area of interest";
    }

    if(!this.availability_day)
    {
      this.avail_log = "Please select employment availability";
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


    if( this.count === 0 && this.selectedLocations && this.selectedLocations.length > 0 && this.selectedLocations.length <= 10 && this.selectedLocations.filter(i => i.visa_not_needed === true).length > 0 && this.selectedcountry.length>0 && this.jobselected.length>0 && this.base_currency && this.salary && this.selectedValue.length > 0 && this.availability_day)
    {
      if(typeof(f.value.expected_salary) === 'string' )
        f.value.expected_salary = parseInt(f.value.expected_salary);
      if(f.value.current_salary && typeof (f.value.current_salary) === 'string') {
        f.value.current_salary = parseInt(f.value.current_salary);

      }
      if(f.value.current_salary === '') {
        f.value.current_salary = 0;
      }
      f.value.current_salary = parseInt(f.value.current_salary);
      f.value.expected_salary = parseInt(f.value.expected_salary);
      f.value.selectedlocations = this.validatedLocation;
      console.log(f.value);
      this.authenticationService.job(this.currentUser._creator, f.value)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/resume']);
            }

            if(data['error'] )
            {
              this.log= data['error'];
            }

          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }


          });

    }
    else{
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);

  }


  suggestedOptions() {
   // this.cities = ['Afghanistan (city)', 'Albania (country)', 'Algeria (city)', 'Andorra (country)', 'Angola (city)', 'Antigua & Deps (city)', 'Argentina (city)', 'Armenia (city)', 'Australia (city)', 'Austria (city)', 'Azerbaijan (city)', 'Bahamas (city)', 'Bahrain (city)', 'Bangladesh (city)', 'Barbados (city)', 'Belarus (city)', 'Belgium (city)', 'Belize (city)', 'Benin (city)', 'Bhutan (city)', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
  let citiesInput = {
    locations: [{
      city: {
        _id: 1234,
        city: "London",
        country: "United Kingdom",
        active: true
      }
    },{
      country: "Australia"
    },{
      country: "India"
    },{
      city: {
        _id: 2345,
        city: "Toronto",
        country: "Canada",
        active: true
      }
    }]
  };

  let citiesOptions=[];
  for(let cities of citiesInput.locations) {
    if(cities['city']) {
      let cityString = cities['city'].city + " (city)";
      let countryString = cities['city'].country + " (country)";
      citiesOptions.push({name : countryString });
      citiesOptions.push({_id : cities['city']._id , name : cityString});
    }
    else {
      let countryString = cities['country'] + " (country)";
      citiesOptions.push({name: countryString});
    }
  }
    this.cities = citiesOptions;
    console.log(this.cities);

  }


  selectedValueFunction(e) {
    console.log(e.target.value);
    if(this.cities.find(x => x.name === e.target.value)) {
      this.countriesModel = '';
      this.cities = [];
      if(this.selectedValueArray.length > 10) {
        this.error = 'You can select maximum 10 locations';
        setInterval(() => {
          this.error = "" ;
        }, 5000);
      }
      else {
        if(this.selectedValueArray.find(x => x.name === e.target.value)) {
          this.error = 'This location has already been selected';
          setInterval(() => {
            this.error = "" ;
          }, 4000);
        }
        else {
          this.selectedValueArray.push({name: e.target.value, visa_not_needed:false});
        }
        this.selectedValueArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
      }

      console.log(this.selectedValueArray);
    }
    else {
      console.log("do nothing");
    }

  }

  updateCitiesOptions(e) {
    let objIndex = this.selectedValueArray.findIndex((obj => obj.name === e.target.value));
    this.selectedValueArray[objIndex].visa_not_needed = e.target.checked;
    this.selectedLocations = this.selectedValueArray;
    console.log(this.selectedLocations);
  }

  deleteExpRow(i){
    this.selectedValueArray.splice(i, 1);
    console.log(this.selectedValueArray);
  }


}
