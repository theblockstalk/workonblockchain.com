import {Component, Output, OnInit, ElementRef, AfterViewInit, ViewChild, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd  } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {HttpClient} from '@angular/common/http';
import { DataService } from "../../data.service";
declare var $: any;
import {constants} from "../../../constants/constants";
import {changeLocationDisplayFormat, getNameFromValue} from "../../../services/object";

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
  text;
  platforms;
  cand_id;
  info;
  url;
  user_id;
  public_data;
  github;
  stack;
  linkedin_account;
  medium_account;
  expected_currency;
  expected_salary;
  email;
  currentwork;
  message;
  candidateMsgTitle;
  candidateMsgBody;
  candidate_status;
  date_created;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;
  infoo;
  base_country;
  base_city;
  commercial_skills;
  formal_skills;
  selectedValueArray;
  visaRequiredArray = [];
  noVisaArray = [];
  employee: any = {};
  contractor:any = {};
  volunteer: any = {};
  stackoverflow_url;
  personal_website_url;
  country_code;
  progress_bar_value = 15;
  linked_websites;
  progress_bar_class = 'progress-bar bg-warning';
  work_history_progress = 0;
  routerUrl;

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

  roles = constants.workRoles;
  contractorTypes = constants.contractorTypes;

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
        this.routerUrl = '/users/talent/edit';
        this.information.country = -1;

        this.authenticationService.getCandidateProfileById(this.currentUser._id , false)
          .subscribe(
            data => {
              if(data)
              {
                this.selectedValueArray = [];
                this.date_created = data['candidate'].history[data['candidate'].history.length-1].timestamp;
                this.candidate_status = data['candidate'].latest_status;


                if(data['first_name'] && data['last_name'] && data['contact_number'] && data['nationality'] &&
                   data['candidate'].interest_areas && data['candidate'].why_work && data['candidate'].description
                  && !data['candidate'].base_country && !data['candidate'].base_city){
                  $("#popModal_b").modal({
                    show: true
                  });

                }

                this.id = data['_id'];
                this.email =data['email'];
                this.linked_websites = 0;
                if(data['candidate'].github_account) {
                  this.linked_websites++;
                  this.github = data['candidate'].github_account
                };
                if(data['candidate'].stackexchange_account) {
                  this.linked_websites++;
                  this.stack = data['candidate'].stackexchange_account;
                }

                if(data['candidate'].linkedin_account) {
                  this.linked_websites++;
                  this.linkedin_account = data['candidate'].linkedin_account;
                }
                if(data['candidate'].medium_account) {
                  this.linked_websites++;
                  this.medium_account = data['candidate'].medium_account;
                }

                if(data['candidate'].stackoverflow_url) {
                  this.linked_websites++;
                  this.stackoverflow_url = data['candidate'].stackoverflow_url;
                }
                if(data['candidate'].personal_website_url) {
                  this.linked_websites++;
                  this.personal_website_url = data['candidate'].personal_website_url;
                }
                console.log(this.linked_websites);
                if(this.linked_websites>=2) {
                  this.progress_bar_class = 'progress-bar bg-warning';
                  this.progress_bar_value = 25;
                }

                if(data['candidate'] && data['candidate'].base_country){
                  this.base_country = data['candidate'].base_country;
                }
                if(data['candidate'] && data['candidate'].base_city){
                  this.base_city = data['candidate'].base_city;
                }

                this.first_name=data['first_name'];
                this.last_name =data['last_name'];
                this.nationality = data['nationality'];

                this.contact_number = '';
                let contact_number = data['contact_number'];
                contact_number = contact_number.replace(/^00/, '+');
                contact_number = contact_number.split(" ");
                if(contact_number.length>1) {
                  for (let i = 0; i < contact_number.length; i++) {
                    if (i === 0) this.country_code = '('+contact_number[i]+')';
                    else this.contact_number = this.contact_number+''+contact_number[i];
                  }
                  this.contact_number = this.country_code+' '+this.contact_number
                }
                else this.contact_number = contact_number[0];

                this.description =data['candidate'].description;
                if(data['candidate'].work_history && data['candidate'].work_history.length > 0)
                {
                  for(let workHistory of data['candidate'].work_history){
                    this.work_history_progress = 1;
                    if(workHistory.description.length < 100){
                      this.work_history_progress = 0;
                      if(this.linked_websites>=2) {
                        this.progress_bar_class = 'progress-bar bg-info';
                        this.progress_bar_value = 50;
                      }
                      break;
                    }
                  }

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

                if(data['candidate'].employee) {
                  this.employee.value = data['candidate'].employee;
                  const locationArray = changeLocationDisplayFormat(this.employee.value.location);
                  this.employee.noVisaArray = locationArray.noVisaArray;
                  this.employee.visaRequiredArray = locationArray.visaRequiredArray;
                  let rolesValue = [];
                  for(let role of this.employee.value.roles){
                    const filteredArray = getNameFromValue(this.roles,role);
                    rolesValue.push(filteredArray.name);
                  }
                  this.employee.value.roles = rolesValue.sort();
                  let availability = getNameFromValue(constants.workAvailability,this.employee.value.employment_availability);
                  this.employee.value.employment_availability = availability.name;                }

                if(data['candidate'].contractor) {
                  this.contractor.value = data['candidate'].contractor;
                  const locationArray = changeLocationDisplayFormat(this.contractor.value.location);
                  this.contractor.noVisaArray = locationArray.noVisaArray;
                  this.contractor.visaRequiredArray = locationArray.visaRequiredArray;
                  let rolesValue = [];
                  for(let role of this.contractor.value.roles){
                    const filteredArray = getNameFromValue(this.roles,role);
                    rolesValue.push(filteredArray.name);
                  }
                  this.contractor.value.roles = rolesValue.sort();
                  let contractorType = [];
                  for(let type of this.contractor.value.contractor_type) {
                    const filteredArray = getNameFromValue(this.contractorTypes , type);
                    contractorType.push(filteredArray.name);
                  }
                  this.contractor.value.contractor_type = contractorType;
                }

                if(data['candidate'].volunteer) {
                  this.volunteer.value = data['candidate'].volunteer;
                  const locationArray = changeLocationDisplayFormat(this.volunteer.value.location);
                  this.volunteer.noVisaArray = locationArray.noVisaArray;
                  this.volunteer.visaRequiredArray = locationArray.visaRequiredArray;
                  let rolesValue = [];
                  for(let role of this.volunteer.value.roles){
                    const filteredArray = getNameFromValue(this.roles,role);
                    rolesValue.push(filteredArray.name);
                  }
                  this.volunteer.value.roles = rolesValue.sort();
                }

                if(data['candidate'].interest_areas) {
                  this.interest_area = data['candidate'].interest_areas;
                  this.interest_area.sort();
                }


                if(data['candidate'].why_work) this.why_work = data['candidate'].why_work;

                let commercial_platforms_check = 0,experimented_platforms_check = 0,commercial_skills_check=0;
                if(data['candidate'].blockchain) {
                  if(data['candidate'].blockchain.commercial_platforms) {
                    commercial_platforms_check = 1;
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
                    experimented_platforms_check = 1;
                    this.experimented = data['candidate'].blockchain.experimented_platforms;
                    if(this.experimented && this.experimented.length>0){
                      this.experimented.sort(function(a, b){
                        if(a < b) { return -1; }
                        if(a > b) { return 1; }
                        return 0;
                      })
                    }
                  }

                  if(data['candidate'].blockchain.description_commercial_platforms) {
                    this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
                    commercial_platforms_check = 0;
                    if(this.description_commercial_platforms.length > 100) commercial_platforms_check = 1;
                  }

                  if(data['candidate'].blockchain.description_experimented_platforms) {
                    this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
                    experimented_platforms_check = 0;
                    if(this.description_experimented_platforms.length>100) experimented_platforms_check = 1;
                  }

                  if(data['candidate'].blockchain.description_commercial_skills) {
                    this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
                    commercial_skills_check = 0;
                    if(this.description_commercial_skills.length> 100) commercial_skills_check = 1;
                  }

                  if(data['candidate'].blockchain.commercial_skills) {
                    commercial_skills_check = 1;
                    this.commercial_skills = data['candidate'].blockchain.commercial_skills;
                    this.commercial_skills.sort(function(a, b){
                      if(a.skill < b.skill) { return -1; }
                      if(a.skill > b.skill) { return 1; }
                      return 0;
                    })
                  }
                }
                if (commercial_platforms_check && experimented_platforms_check && commercial_skills_check){
                  if(this.linked_websites>=2 && this.work_history_progress === 1) {
                    this.progress_bar_class = 'progress-bar bg-info';
                    this.progress_bar_value = 75;
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


                if(data['candidate'].current_currency) this.current_currency = data['candidate'].current_currency;
                if(data['candidate'].current_salary) this.current_salary = data['candidate'].current_salary;


                if(data['image'] != null )
                {
                  if(this.linked_websites>=2 && this.work_history_progress) {
                    this.progress_bar_class = 'progress-bar bg-success';
                    this.progress_bar_value = 100;
                  }
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
              if(data)
              {
                this.candidateMsgTitle = data['page_title'];
                this.candidateMsgBody = data['page_content'];
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
    if(this.information.country !== -1 && this.information.city)
    {
      this.authenticationService.edit_candidate_profile(this.currentUser._id,this.information, false)
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

  website_url;
  websiteUrl(link) {
    let loc = link;
    let x = loc.split("/");
    if (x[0] === 'http:' || x[0] === 'https:') {
      this.website_url = link;
      return this.website_url;
    }
    else {
      this.website_url = 'http://' + link;
      return this.website_url;
    }
  }

}
