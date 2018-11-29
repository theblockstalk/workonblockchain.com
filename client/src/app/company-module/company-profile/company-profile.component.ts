import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm , FormGroup,FormControl,FormBuilder} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit ,  AfterViewInit
{

  currentUser: User;
  first_name;last_name;company_name;job_title;company_website;company_phone;company_country;
  company_city;company_postcode;company_description;company_founded;company_funded;no_of_employees;
    imgPath;
    email;
  companyMsgTitle;
  companyMsgBody;
  preferncesForm : FormGroup;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  availability_day_log;
  current_currency_log;
  current_salary_log;
  email_notification_log;
  error_msg;
  log;
  about_active_class;
  positionSelected = [];
  current_salary;
  locationSelected = [];
  jobTypesSelected = [];
  index;
  blockchainSelected = [];
  languageSelected = [];
  other_technologies;
  avail_day;
  saved_searche;
  constructor( private route: ActivatedRoute, private _fb: FormBuilder ,
        private router: Router,
        private authenticationService: UserService) { }

    sectionScroll;
    internalRoute(page,dst){
    this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
}

    doScroll() {

    if (!this.sectionScroll) {
      return;
    }
    try {
      var elements = document.getElementById(this.sectionScroll);

      elements.scrollIntoView();
    }
    finally{
      this.sectionScroll = null;
    }
  }

    ngAfterViewInit(): void
     {
       window.scrollTo(0, 0);
       setTimeout(() => {
         $('.selectpicker').selectpicker('refresh');
       }, 150);
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
   url;
  ngOnInit()
  {
     // //console.log(this.htmlContent);
       this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.doScroll();
      this.sectionScroll= null;
    });

      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(!this.currentUser)
      {
          this.router.navigate(['/login']);
      }
      if(this.currentUser && this.currentUser.type === 'company')
      {
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

                  //console.log(data);
                  if(!data.terms_id)
                  {
                      this.router.navigate(['/company_wizard']);
                  }


                  else if(!data.company_founded || !data.no_of_employees || !data.company_funded || !data.company_description )
                  {
                      this.router.navigate(['/about_comp']);
                  }

                  else if(((new Date(data._creator.created_date) > new Date('2018/11/28')) && (!data.saved_searches || data.saved_searches.length === 0))) {
                    this.router.navigate(['/preferences']);
                  }

                  else
                  {
                      this.first_name=data.first_name;
                      this.email=data._creator.email;
                      this.last_name=data.last_name;
                      this.company_name=data.company_name;
                      this.job_title=data.job_title;
                      if(data.company_website)
                      {
                            let loc= data.company_website;
                            let x = loc.split("/");
                            if(x[0] === 'http:' || x[0] === 'https:')
                            {
                                this.company_website = data.company_website;
                            }
                            else
                            {
                                this.company_website = 'http://' + data.company_website;
                            }
                      }
                      this.company_phone =data.company_phone;
                      this.company_country =data.company_country;
                      this.company_city=data.company_city;
                      this.company_postcode=data.company_postcode;
                      this.company_description=data.company_description;
                      this.company_founded =data.company_founded;
                      this.company_funded=data.company_funded;
                      this.no_of_employees=data.no_of_employees;
                      if(data.company_logo != null )
                      {
                      ////console.log(data[0].image);

                        this.imgPath =  data.company_logo;

                        //console.log(this.imgPath);

                      }

                    console.log(data);
                    if(data.terms_id && data.company_founded && data.no_of_employees && data.company_funded && data.company_description && !data.saved_searches ) {
                      console.log("show popup");
                      $('#popModal_b').modal('show');
                      $(window).load(function()
                      {
                        console.log("windows load");
                        $('#popModal_b').modal('show');
                      });
                    }
                    if(data.saved_searches) {
                      this.saved_searche = data.saved_searches;

                    }

                  }



                },
                error =>
                {

                  if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                   console.log(error['error']['message']);
                  }


                });
        this.authenticationService.get_page_content('Company popup message')
          .subscribe(
            data => {
              if(data)
              {
                this.companyMsgTitle= data[0].page_title;
                this.companyMsgBody = data[0].page_content;
              }
            });
      }
      else
       {
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

            if(data.success === true) {
              this.saved_searche = this.saved_searches;
              $('#popModal_b').modal('hide');

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

  redirectToCompany()
  {
    $('#popModal').modal('hide');
    this.router.navigate(['/company_profile']);
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
}
