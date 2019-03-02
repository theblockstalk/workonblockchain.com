import { Component, OnInit , AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormGroup,FormControl,FormBuilder } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  preferncesForm : FormGroup;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  current_currency_log;
  current_salary_log;
  blockchain_log;
  skills_log;
  email_notification_log;
  error_msg;
  log;
  currentUser: User;
  about_active_class;
  terms_active_class;
  companyMsgTitle;
  companyMsgBody;
  positionSelected = [];
  current_salary;
  locationSelected = [];
  jobTypesSelected = [];
  index;
  blockchainSelected = [];
  order_preferences= [];
  languageSelected = [];
  other_technologies;
  pref_active_class;
  cities;
  selectedValueArray=[];
  error;
  selectedLocations;
  emptyInput;

  constructor(private _fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient, private router: Router, private authenticationService: UserService) {
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }

  ngAfterViewChecked() {

  }

  residenceCountries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

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

  currency = ["£ GBP" ,"€ EUR" , "$ USD"];

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

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type === 'company') {

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


      this.preferncesForm = new FormGroup({
        name :  new FormControl(),
        location: new FormControl(),
        visa_needed: new FormControl(),
        job_type: new FormControl(),
        position: new FormControl(),
        current_currency: new FormControl(),
        current_salary: new FormControl(),
        blockchain: new FormControl(),
        skills: new FormControl(),
        other_technologies: new FormControl(),
        when_receive_email_notitfications: new FormControl(),
        order_preferences: new FormControl(),
        residence_country: new FormControl(),
      });

		this.preferncesForm = this._fb.group({
                  name: [''],
                  location: [],
                  visa_needed: [false],
                  job_type: [],
                  position: [],
                  current_currency: [],
                  current_salary: [''],
                  blockchain: [],
                  skills: [],
                  other_technologies: [''],
				  when_receive_email_notitfications: [''],
                  order_preferences: [],
                  residence_country: [],
                });
      this.authenticationService.getCurrentCompany(this.currentUser._creator)
        .subscribe(
          data =>
          {
            if(data['terms_id'])
            {
              this.terms_active_class = 'fa fa-check-circle text-success';
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }
            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              this.pref_active_class = 'fa fa-check-circle text-success';
              this.preferncesForm = this._fb.group({
                name: [data['saved_searches'][0].name],
                location: [],
                visa_needed: [data['saved_searches'][0].visa_needed],
                job_type: [data['saved_searches'][0].job_type],
                position: [data['saved_searches'][0].position],
                current_currency: [data['saved_searches'][0].current_currency],
                current_salary: [data['saved_searches'][0].current_salary],
                blockchain: [data['saved_searches'][0].blockchain],
                skills: [data['saved_searches'][0].skills],
                other_technologies: [data['saved_searches'][0].other_technologies],
                when_receive_email_notitfications: [data['when_receive_email_notitfications']],
                order_preferences: [data['saved_searches'][0].order_preferences],
                residence_country: [data['saved_searches'][0].residence_country],
              });

              /*for (let locations of data['saved_searches'][0].location) {
                for(let option of this.locations) {
                  if(option.name === locations ) {
                    this.locationSelected.push(option.name);
                  }
                }
              }*/

              if(data['saved_searches'][0].location)
              {
                for (let country1 of data['saved_searches'][0].location)
                {
                  if (country1['remote'] === true) {
                    this.selectedValueArray.push({name: 'Remote' , visa_needed : country1.visa_needed});
                  }

                  if (country1['city']) {
                    let city = country1['city'].city + ", " + country1['city'].country;
                    this.selectedValueArray.push({_id:country1['city']._id ,name: city , visa_needed : country1.visa_needed});
                  }
                }

                this.selectedValueArray.sort();
                if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
                  let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
                  this.selectedValueArray.splice(0, 0, remoteValue);
                  this.selectedValueArray = this.filter_array(this.selectedValueArray);

                }
                this.selectedLocations = this.selectedValueArray;
              }
              for (let job_types of data['saved_searches'][0].job_type) {
                for(let option of this.job_types) {
                  if(option === job_types ) {
                    this.jobTypesSelected.push(option);
                  }
                }
              }
              for (let positions of data['saved_searches'][0].position) {
                for(let option of this.roles) {
                  if(option.name === positions ) {
                    this.positionSelected.push(option.name);
                  }
                }
              }
              if(data['saved_searches'][0].blockchain && data['saved_searches'][0].blockchain.length > 0) {
                for(let blockchains of data['saved_searches'][0].blockchain) {
                  for(let option of this.blockchain) {
                    if(option.name === blockchains) {
                      this.blockchainSelected.push(option.name);
                    }
                  }
                }
              }

              if(data['saved_searches'][0].order_preferences && data['saved_searches'][0].order_preferences.length > 0) {
                for(let blockchains of data['saved_searches'][0].blockchain) {
                  for(let option of this.blockchain) {
                    if(option.name === blockchains) {
                      this.order_preferences.push(option.name);
                    }
                  }
                }
              }

              if(data['saved_searches'][0].skills && data['saved_searches'][0].skills.length > 0) {
                for(let skills of data['saved_searches'][0].skills) {
                  for(let option of this.language_opt) {
                    if(option.name === skills) {
                      this.languageSelected.push(option.name);
                    }
                  }
                }
              }
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
              // this.router.navigate(['/not_found']);
            }
          });

      this.authenticationService.get_page_content('Company popup message')
        .subscribe(
          data => {
            if(data && data[0])
            {
              this.companyMsgTitle= data[0]['page_title'];
              this.companyMsgBody = data[0]['page_content'];
            }
          });
    }
    else {
      this.router.navigate(['/not_found']);
    }



  }
  validatedLocation=[];
  country_input_log;
  country_log;
  residence_country_log;
  name_log;

  checkNumber(salary) {
    if(!Number(this.preferncesForm.value.current_salary)) {
      return true;
    }
    else {
      return false;
    }

  }
  candidate_prefernces() {
    this.saved_searches = [];
    this.error_msg = "";
    this.validatedLocation = [];
    if(!this.selectedValueArray || this.selectedValueArray.length <= 0) {
      this.country_input_log = "Please select at least one location";
    }
    if(!this.selectedLocations) {
      this.country_log = "Please select at least one location";
    }
    if(this.selectedLocations && this.selectedLocations.length > 0) {
      for(let location of this.selectedLocations) {
        if(location.name.includes(', ')) {
          this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
        }
        if(location.name === 'Remote') {
          this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
        }

      }
    }

    if(this.selectedLocations && this.selectedLocations.length > 10) {
      this.country_log = "Please select maximum 10 locations";
    }

    if(!this.preferncesForm.value.name) {
      this.name_log = "Please enter saved search name";
    }

    if(!this.preferncesForm.value.position || this.preferncesForm.value.position.length === 0) {
      this.position_log = "Please select roles";
    }

    if(!this.preferncesForm.value.current_currency) {
      this.current_currency_log = "Please select available annual salary and currency";
    }
    if(!this.preferncesForm.value.current_salary) {
      this.current_currency_log = "Please select available annual salary and currency";
    }
    if(this.preferncesForm.value.current_salary && !Number(this.preferncesForm.value.current_salary)){
      this.current_currency_log = "Salary should be a number";
    }
    if(!this.preferncesForm.value.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
    }
	let count = 0;
    if(this.preferncesForm.value.residence_country && this.preferncesForm.value.residence_country.length > 50) {
      this.residence_country_log = "Please select maximum 50 countries";
	  count=1;

    }
    if(count === 0 &&this.preferncesForm.value.name && this.selectedLocations && this.selectedLocations.length > 0 && this.selectedLocations.length <= 5   &&
      this.preferncesForm.value.position && this.preferncesForm.value.position.length > 0  &&
      this.preferncesForm.value.current_currency && Number(this.preferncesForm.value.current_salary) &&
      this.preferncesForm.value.when_receive_email_notitfications ) {
      this.preferncesForm.value.location = this.validatedLocation;
      this.preferncesForm.value.current_salary = Number(this.preferncesForm.value.current_salary);
      this.saved_searches.push(this.preferncesForm.value);
		if(!this.preferncesForm.value.job_type) this.preferncesForm.value.job_type = [];
		if(!this.preferncesForm.value.blockchain) this.preferncesForm.value.blockchain = [];
		if(!this.preferncesForm.value.skills) this.preferncesForm.value.skills = [];
		if(!this.preferncesForm.value.order_preferences) this.preferncesForm.value.order_preferences = [];
		if(!this.preferncesForm.value.residence_country) this.preferncesForm.value.residence_country = [];

      let inputQuery : any ={};
      inputQuery.when_receive_email_notitfications = this.preferncesForm.value.when_receive_email_notitfications;
      inputQuery.saved_searches = this.saved_searches;
      this.authenticationService.edit_company_profile(inputQuery)
        .subscribe(
          data =>
          {
            if(data) {
              $('#whatHappensNextModal').modal('show');
            }
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
              this.router.navigate(['/not_found']);
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
              this.router.navigate(['/not_found']);
            }
            else {
              this.log = "Something getting wrong";
            }
          })
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }

  }

  locationSelectedOptions(name) {
    this.index = this.locationSelected.indexOf(name);
    if(this.index  > -1) {
      return 'selected';
    }
    else {
      return ;
    }

  }

  jobTypesSelectedOptions(type) {
    this.index = this.jobTypesSelected.indexOf(type);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  positionSelectedOptions(position) {
    this.index = this.positionSelected.indexOf(position);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  blockchainSelectedOptions(blockchainName) {
    this.index = this.blockchainSelected.indexOf(blockchainName);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  blockchainOrderSelectedOptions(blockchainName) {
    this.index = this.order_preferences.indexOf(blockchainName);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  languageSelectedOptions(lang) {
    this.index = this.languageSelected.indexOf(lang);
    if(this.index > -1) {
      return 'selected';
    }
    else {
      return;
    }
  }

  redirectToCompany()
  {
    $('#whatHappensNextModal').modal('hide');
    this.router.navigate(['/company_profile']);
  }


  suggestedOptions() {
    if(this.preferncesForm.value.location !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(this.preferncesForm.value.location , true)
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
                  citiesOptions.push({_id : cities['city']._id , name : cityString});
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

  selectedValueFunction(e) {

    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+this.preferncesForm.value.location+"']")['dataset'].value;
        this.preferncesForm.get('location').setValue('');
        this.cities = [];
        if(this.selectedValueArray.length > 4) {
          this.error = 'You can select maximum 5 locations';
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
        this.selectedLocations = this.selectedValueArray;
      }
    }

  }

  updateCitiesOptions(e) {
    let objIndex = this.selectedValueArray.findIndex((obj => obj.name === e.target.value));
    this.selectedValueArray[objIndex].visa_needed = e.target.checked;
    this.selectedLocations = this.selectedValueArray;

  }

  deleteLocationRow(i){
    this.selectedValueArray.splice(i, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  checkValidation(value) {
    return value.filter(i => i.visa_needed === true).length;
  }


}
