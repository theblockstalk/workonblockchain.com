import {Component, Output, OnInit, ElementRef, AfterViewInit, ViewChild, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute,NavigationEnd  } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { DataService } from "../../data.service";
import {environment} from '../../../environments/environment';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit ,  AfterViewInit {
  @Output()
  emitFunctionOfParent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('element') element: ElementRef;

  currentUser: User;
  first_name;last_name;description;companyname;degreename;
  interest_area;why_work;availability_day;
  countries;commercial;history;education;
  experimented;languages;current_currency;current_salary;image_src;
  imgPath;nationality;contact_number;id;
  share_link;
  text;
  platforms;
  cand_id;htmlContent;
  info;
  share_url;
  shareurl;
  url;
  user_id;
  public_data;
  github;
  stack;
  linkedin_account;
  medium_account;
  roles;
  expected_currency;
  expected_salary;
  email;
  currentwork;
  message;
  candidateMsgTitle;
  candidateMsgBody;
  candidate_status;
  date_created;
  public loading = false;information: any = {};
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private authenticationService: UserService,private dataservice: DataService,private el: ElementRef)
  {


  }

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
  tweet_text;
  dateA;dateB;
  sort_history;
  date_sort_desc = function (date1, date2)
  {
    // DESCENDING order.
    if (date1.enddate > date2.enddate) return -1;
    if (date1.enddate < date2.enddate) return 1;
    return 0;
  };

  education_sort_desc = function (year1, year2)
  {
    // DESCENDING order.
    if (year1.eduyear > year2.eduyear) return -1;
    if (year1.eduyear < year2.eduyear) return 1;
    return 0;
  };

  infoo;
  base_country;
  base_city;
  commercial_skills;
  formal_skills;
  selectedValueArray;
  visaRequiredArray = [];
  noVisaArray = [];
  ngOnInit()
  {
    this.infoo='';
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.doScroll();
      this.sectionScroll= null;
    });


    this.dataservice.eemailMessage.subscribe(message => this.message = message);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.tweet_text = "@work_blockchain I am looking to work on blockchain projects now!";
    if(this.user_id)
    {

    }

    else
    {

      if(!this.currentUser)
      {
        this.router.navigate(['/login']);
      }
      if(this.currentUser && this.currentUser.type === 'candidate')
      {
        this.information.country = -1;

        this.cand_id= this.currentUser._creator;


        this.authenticationService.getProfileById(this.currentUser._id)
          .subscribe(
            data => {
              if(data)
              {
                this.selectedValueArray = [];
                this.date_created = data['candidate'].status[data['candidate'].status.length-1].timestamp;
                this.candidate_status = data['candidate'].status[0];

                if(data['first_name'] && data['last_name'] && data['contact_number'] && data['nationality'] &&
                  data['candidate'].locations  && data['candidate'].roles && data['candidate'].interest_areas &&
                  data['candidate'].expected_salary && data['candidate'].why_work && data['candidate'].description
                  && !data['candidate'].base_country && !data['candidate'].base_city){
                  $("#popModal_b").modal({
                    show: true
                  });

                }

                this.id = data['_id'];
                this.email =data['email'];
                if(data['candidate'].github_account) this.github = data['candidate'].github_account;
                if(data['candidate'].stackexchange_account) this.stack = data['candidate'].stackexchange_account;

                if(data['candidate'].linkedin_account) this.linkedin_account = data['candidate'].linkedin_account;
                if(data['candidate'].medium_account) this.medium_account = data['candidate'].medium_account;


                if(data['candidate'] && data['candidate'].base_country){
                  this.base_country = data['candidate'].base_country;
                }
                if(data['candidate'] && data['candidate'].base_city){
                  this.base_city = data['candidate'].base_city;
                }


                this.expected_currency = data['candidate'].expected_salary_currency;
                this.expected_salary = data['candidate'].expected_salary;
                this.first_name=data['first_name'];
                this.last_name =data['last_name'];
                this.nationality = data['nationality'];
                this.contact_number =data['contact_number'];
                this.description =data['candidate'].description;
                if(data['candidate'].work_history && data['candidate'].work_history.length > 0)
                {
                  this.history =data['candidate'].work_history;
                  this.history.sort(this.date_sort_desc);
                  for(let data1 of data['candidate'].work_history)
                  {
                    this.companyname = data1.companyname;
                    this.currentwork = data1.currentwork;

                  }
                }

                if(data['candidate'].education_history && data['candidate'].education_history.length > 0) {
                  this.education = data['candidate'].education_history;
                  this.education.sort(this.education_sort_desc);
                  for(let edu of data['candidate'].education_history)
                  {
                    this.degreename = edu.degreename;
                  }
                }

                /*this.countries = data['candidate'].locations;
                this.countries.sort();
                if (this.countries.findIndex(obj => obj.remote === true) > -1) {
                  this.countries = this.filter_array(this.countries);
                }*/

                if(data['candidate'].locations)
                {
                  let citiesArray = [];
                  let countriesArray = [];
                  for (let country1 of data['candidate'].locations)
                  {
                    let locObject : any = {}
                    if (country1['remote'] === true) {
                      this.selectedValueArray.push({name: 'Remote' , visa_needed : false});
                    }

                    if (country1['country']) {
                      locObject.name = country1['country'];
                      locObject.type = 'country';
                      if(country1['visa_needed'] === true) locObject.visa_needed = true;
                      else locObject.visa_needed = false;
                      countriesArray.push(locObject);
                      countriesArray.sort(function(a, b){
                        if(a.name < b.name) { return -1; }
                        if(a.name > b.name) { return 1; }
                        return 0;
                      });
                    }
                    if (country1['city']) {
                      let city = country1['city'].city + ", " + country1['city'].country;
                      locObject.name = city;
                      locObject.type = 'city';
                      if(country1['visa_needed'] === true) locObject.visa_needed = true;
                      else locObject.visa_needed = false;
                      citiesArray.push(locObject);
                      citiesArray.sort(function(a, b){
                        if(a.name < b.name) { return -1; }
                        if(a.name > b.name) { return 1; }
                        return 0;
                      });

                    }

                  }

                  this.countries = citiesArray.concat(countriesArray);
                  this.countries = this.countries.concat(this.selectedValueArray);
                  if(this.countries.find((obj => obj.name === 'Remote'))) {
                    let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
                    this.countries.splice(0, 0, remoteValue);
                    this.countries = this.filter_array(this.countries);

                  }

                  if(this.countries && this.countries.length > 0) {

                    for(let loc of this.countries) {
                      if(loc.visa_needed === true)
                        this.visaRequiredArray.push(loc);
                      if(loc.visa_needed === false)
                        this.noVisaArray.push(loc);
                    }

                  }

                }

                this.interest_area =data['candidate'].interest_areas;
                this.interest_area.sort();
                this.roles  = data['candidate'].roles;
                this.roles.sort();
                if(data['candidate'].availability_day === '1 month') this.availability_day = '1 month notice period';
                else if(data['candidate'].availability_day === '2 months') this.availability_day = '2 months notice period';
                else if(data['candidate'].availability_day === '3 months') this.availability_day = '3 months notice period';
                else if(data['candidate'].availability_day === 'Longer than 3 months') this.availability_day = '3+ months notice period';
                else this.availability_day =data['candidate'].availability_day;

                this.why_work = data['candidate'].why_work;
                if(data['candidate'].blockchain) {
                  if(data['candidate'].blockchain.commercial_platforms) {
                    this.commercial = data['candidate'].blockchain.commercial_platforms;
                    if(this.commercial && this.commercial.length>0){
                      this.commercial.sort(function(a, b){
                        if(a.name < b.name) { return -1; }
                        if(a.name > b.name) { return 1; }
                        return 0;
                      })
                    }
                  }

                  if(data['candidate'].blockchain.experimented_platforms) {
                    this.experimented = data['candidate'].blockchain.experimented_platforms;
                    if(this.experimented && this.experimented.length>0){
                      this.experimented.sort(function(a, b){
                        if(a < b) { return -1; }
                        if(a > b) { return 1; }
                        return 0;
                      })
                    }
                  }
                  if(data['candidate'].blockchain.smart_contract_platforms) {
                    this.platforms=data['candidate'].blockchain.smart_contract_platforms;
                    if(this.platforms && this.platforms.length>0){
                      this.platforms.sort(function(a, b){
                        if(a.name < b.name) { return -1; }
                        if(a.name > b.name) { return 1; }
                        return 0;
                      })
                    }
                  }

                  if(data['candidate'].blockchain.commercial_skills) {
                    this.commercial_skills = data['candidate'].blockchain.commercial_skills;
                    this.commercial_skills.sort(function(a, b){
                      if(a.skill < b.skill) { return -1; }
                      if(a.skill > b.skill) { return 1; }
                      return 0;
                    })
                  }
                  if(data['candidate'].blockchain.formal_skills) {
                    this.formal_skills = data['candidate'].blockchain.formal_skills;
                    this.formal_skills.sort(function(a, b){
                      if(a.skill < b.skill) { return -1; }
                      if(a.skill > b.skill) { return 1; }
                      return 0;
                    })
                  }
                }



                if(data['candidate'].programming_languages) {
                  this.languages= data['candidate'].programming_languages;
                  if(this.languages && this.languages.length>0){
                    this.languages.sort(function(a, b){
                      if(a.language < b.language) { return -1; }
                      if(a.language > b.language) { return 1; }
                      return 0;
                    })
                  }
                }


                this.current_currency = data['candidate'].current_currency;
                this.current_salary = data['candidate'].current_salary;


                if(data['image'] != null )
                {

                  this.imgPath = data['image'];

                }

                this.infoo= data;
              }


            },
            err =>
            {
              if(err.message == 500 || err.message == 401)
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

        this.authenticationService.get_page_content('Candidate popup message')
          .subscribe(
            data => {
              if(data && data[0])
              {
                this.candidateMsgTitle = data[0]['page_title'];
                this.candidateMsgBody = data[0]['page_content'];
              }
            });
      }
      else
      {
        this.router.navigate(['/not_found']);
      }

    }


  }

  base_countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

  country_log;
  city_log;

  about()
  {

    if(this.information.country === -1)
    {
      this.country_log ="Please choose base country";
    }
    if(!this.information.city)
    {
      this.city_log ="Please enter base city";
    }
    if(this.information.country !== -1 && this.information.city  )
    {
      this.authenticationService.about(this.currentUser._creator,this.information)
        .subscribe(
          data =>
          {
            if(data)
            {

              this.base_country = this.information.country;
              this.base_city = this.information.city;

              $('#popModal_b').modal('hide');

            }

          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              window.location.href = '/login';
            }

            if(error.message === 403)
            {
            }
          });

    }

  }
  temp;
  index;
  countriesArray=[];
  /*swapLocations(locations , index1 , value) {
    this.temp = locations[index1];
    this.countriesArray[0]="remote";
    this.


  }*/

  filter_array(arr)
  {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }



}
