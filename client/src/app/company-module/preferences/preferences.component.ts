import { Component, OnInit , AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormGroup,FormControl,FormBuilder } from '@angular/forms';
declare var $:any;
import {ScriptService} from '../../scripts/script.service';

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
  availability_day_log;
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
  languageSelected = [];
  other_technologies;
  avail_day;
  pref_active_class;

  constructor(private scriptService : ScriptService,private _fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient, private router: Router, private authenticationService: UserService) {
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    $('.selectpicker').selectpicker();
  }

  ngAfterViewChecked() {
    $('.selectpicker').selectpicker('refresh');
  }

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
    {name:'Researcher', value:'Researcher ', checked:false},
    {name:'Mobile app developer', value:'Mobile app developer', checked:false},
    {name:'Data scientist', value:'Data scientist', checked:false},
    {name:'Security specialist ', value:'Security specialist', checked:false},
  ];

  currency = ["£ GBP" ,"€ EUR" , "$ USD"];

  availability = [
    {name : "Now" , value : "Now"},
    {name : "1 month" , value : "1 month"},
    {name : "2 months" , value : "2 months"},
    {name : "3 months" , value : "3 months"},
    {name : "Longer than 3 months" , value : "Longer than 3 months"},
  ]

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
        location: new FormControl(),
        job_type: new FormControl(),
        position: new FormControl(),
        availability_day: new FormControl(),
        current_currency: new FormControl(),
        current_salary: new FormControl(),
        blockchain: new FormControl(),
        skills: new FormControl(),
        other_technologies: new FormControl(),
        when_receive_email_notitfications: new FormControl(),
      });

      this.authenticationService.getCurrentCompany(this.currentUser._id)
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
                location: [data['saved_searches'][0].location],
                job_type: [data['saved_searches'][0].job_type],
                position: [data['saved_searches'][0].position],
                availability_day: [data['saved_searches'][0].availability_day],
                current_currency: [data['saved_searches'][0].current_currency],
                current_salary: [data['saved_searches'][0].current_salary],
                blockchain: [data['saved_searches'][0].blockchain],
                skills: [data['saved_searches'][0].skills],
                other_technologies: [data['saved_searches'][0].other_technologies],
                when_receive_email_notitfications: [data['saved_searches'][0].when_receive_email_notitfications],
              });

              for (let locations of data['saved_searches'][0].location) {
                for(let option of this.locations) {
                  if(option.name === locations ) {
                    this.locationSelected.push(option.name);
                  }
                }
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
            if(data)
            {
              this.companyMsgTitle= data['page_title'];
              this.companyMsgBody = data['page_content'];
            }
          });
    }
    else {
      this.router.navigate(['/not_found']);
    }



  }

  candidate_prefernces() {
    this.error_msg = "";

    if(!this.preferncesForm.value.location || this.preferncesForm.value.location.length === 0 ) {
      this.location_log = "Please select where are you hiring";
    }
    if(!this.preferncesForm.value.job_type || this.preferncesForm.value.job_type.length === 0) {
      this.job_type_log = "Please select position types";
    }
    if(!this.preferncesForm.value.position || this.preferncesForm.value.position.length === 0) {
      this.position_log = "Please select roles";
    }
    if(!this.preferncesForm.value.availability_day) {
      this.availability_day_log = "Please select your availability day";
    }
    if(!this.preferncesForm.value.current_currency) {
      this.current_currency_log = "Please select available annual salary and currency";
    }
    if(!this.preferncesForm.value.current_salary) {
      this.current_currency_log = "Please select available annual salary and currency";
    }
    /*if(!this.preferncesForm.value.blockchain || this.preferncesForm.value.blockchain.length === 0) {
      this.blockchain_log = "Please select blockchain technologies";
    }
    if(!this.preferncesForm.value.skills || this.preferncesForm.value.skills.length === 0) {
      this.skills_log = "Please select programing languages";
    }*/
    if(!this.preferncesForm.value.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
    }
    if(this.preferncesForm.value.location && this.preferncesForm.value.location.length > 0 &&
      this.preferncesForm.value.job_type &&  this.preferncesForm.value.job_type.length > 0 &&
      this.preferncesForm.value.position && this.preferncesForm.value.position.length > 0 &&
      this.preferncesForm.value.availability_day && this.preferncesForm.value.current_currency && this.preferncesForm.value.current_salary &&
      this.preferncesForm.value.when_receive_email_notitfications) {

      this.saved_searches.push(this.preferncesForm.value);
      this.authenticationService.candidate_prefernece(this.saved_searches)
        .subscribe(
          data =>
          {
            if(data['success'] === true) {
              $('#popModal').modal('show');
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
      this.error_msg = "There is a field that still needs completion. Please scroll up.";
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
    $('#popModal').modal('hide');
    this.router.navigate(['/company_profile']);
  }

}
