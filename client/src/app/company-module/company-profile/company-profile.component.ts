import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm , FormGroup,FormControl,FormBuilder} from '@angular/forms';
import {isPlatformBrowser} from "@angular/common";
declare var $:any;

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit ,  AfterViewInit {

  currentUser: any;
  first_name;last_name;company_name;job_title;company_website;company_phone;company_country;
  company_city;company_postcode;company_description;company_founded;company_funded;no_of_employees;
  imgPath;
  email;
  companyMsgTitle;
  companyMsgBody;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  availability_day_log;
  current_currency_log;
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
  selectedValueArray = [];
  countries;
  when_receive_email_notitfications;
  country_code;discount;referred_name;price_plan;

  constructor( private route: ActivatedRoute, private _fb: FormBuilder ,
               private router: Router,
               private authenticationService: UserService,
               @Inject(PLATFORM_ID) private platformId: Object) { }

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
  }

  url;

  getLocation(location) {
    this.selectedValueArray = [];
    for (let country1 of location)
    {
      let locObject : any = {}
      if (country1['remote'] === true) {
        this.selectedValueArray.push({name: 'Remote'});

      }

      if (country1['city']) {
        let city = country1['city'].city + ", " + country1['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        this.selectedValueArray.push(locObject);
      }

    }
    this.countries = this.selectedValueArray;
    this.countries.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
    if(this.countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
      this.countries.splice(0, 0, remoteValue);
      this.countries = this.filter_array(this.countries);

    }

    return this.countries;

  }
  ngOnInit()
  {
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

      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
        .subscribe(
          data =>
          {
            if(!data['terms_id'])
            {
              this.router.navigate(['/company_wizard']);
            }


            else if(!data['company_founded'] || !data['no_of_employees'] || !data['company_funded'] || !data['company_description'] )
            {
              this.router.navigate(['/about_comp']);
            }

            else if(((new Date(data['_creator'].created_date) > new Date('2018/11/28')) && (!data['saved_searches'] || data['saved_searches'].length === 0))) {
              this.router.navigate(['/preferences']);
            }

            else
            {
              this.first_name=data['first_name'];
              this.email=data['_creator'].email;
              this.last_name=data['last_name'];
              this.company_name=data['company_name'];
              this.job_title=data['job_title'];
              if(data['company_website'])
              {
                let loc= data['company_website'];
                let x = loc.split("/");
                if(x[0] === 'http:' || x[0] === 'https:')
                {
                  this.company_website = data['company_website'];
                }
                else
                {
                  this.company_website = 'http://' + data['company_website'];
                }
              }

              this.company_phone = '';
              let contact_number = data['company_phone'];
              contact_number = contact_number.replace(/^00/, '+');
              contact_number = contact_number.split(" ");
              if(contact_number.length>1) {
                for (let i = 0; i < contact_number.length; i++) {
                  if (i === 0) this.country_code = '('+contact_number[i]+')';
                  else this.company_phone = this.company_phone+''+contact_number[i];
                }
                this.company_phone = this.country_code+' '+this.company_phone
              }
              else this.company_phone = contact_number[0];

              this.company_country =data['company_country'];
              this.company_city=data['company_city'];
              this.company_postcode=data['company_postcode'];
              this.company_description=data['company_description'];
              this.company_founded =data['company_founded'];
              this.company_funded=data['company_funded'];
              this.no_of_employees=data['no_of_employees'];
              this.when_receive_email_notitfications = data['when_receive_email_notitfications'];
              if(data['discount']) this.discount = data['discount'];

              if (data['name']) this.referred_name = data['name'];
              else if(data['_creator'].referred_email) this.referred_name = data['_creator'].referred_email;

              this.price_plan = 'Basic';

              if(data['company_logo'] != null )
              {
                this.imgPath =  data['company_logo'];
              }

              if(data['terms_id'] && data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'] && !data['saved_searches'] ) {
                if (isPlatformBrowser(this.platformId)) $('#popModal_b').modal('show');
              }
              if(data['saved_searches']) {
                this.saved_searche = data['saved_searches'];

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
              this.companyMsgTitle = data['page_title'];
              this.companyMsgBody = data['page_content'];
            }
          });
    }
    else
    {
      this.router.navigate(['/not_found']);
    }
  }

  redirectToCompany()
  {
    if (isPlatformBrowser(this.platformId)) $('#popModal').modal('hide');
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

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }
}
