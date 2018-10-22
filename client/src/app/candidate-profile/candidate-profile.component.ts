import {Component, Output, OnInit, ElementRef, AfterViewInit, ViewChild, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute,NavigationEnd  } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../data.service";
import {environment} from '../../environments/environment';
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
  roles;
  expected_currency;
  expected_salary;
  email;
  currentwork;
  message;
  candidateMsgTitle;
  candidateMsgBody;
  public loading = false;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private authenticationService: UserService,private dataservice: DataService,location: Location)
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
  ngOnInit()
  {
    this.emitFunctionOfParent.emit();
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
      if(this.currentUser && this.currentUser.type == 'candidate')
      {
        this.cand_id= this.currentUser._creator;


        this.authenticationService.getProfileById(this.currentUser._id)
          .subscribe(
            data => {
              if(data)
              {
                this.id = data._creator._id;
                this.email =data._creator.email;

                if(data.github_account)
                {
                  this.github=data.github_account;
                }
                if(data.stackexchange_account)
                {
                  this.stack=data.stackexchange_account;
                }
                if(data.base_country){
                  this.base_country = data.base_country;
                }
                if(data.base_city){
                  this.base_city = data.base_city;
                 }


                this.expected_currency = data.expected_salary_currency;
                this.expected_salary = data.expected_salary;
                this.first_name=data.first_name;
                this.last_name =data.last_name;
                this.nationality = data.nationality;
                this.contact_number =data.contact_number;
                this.description =data.description;
                this.history =data.work_history;
                this.history.sort(this.date_sort_desc);
                this.education = data.education_history;
                this.education.sort(this.education_sort_desc);
                for(let data1 of data.work_history)
                {
                  this.companyname = data1.companyname;
                  this.currentwork = data1.currentwork;

                }
                for(let edu of data.education_history)
                {
                  this.degreename = edu.degreename;
                }
                this.countries = data.locations;
                this.interest_area =data.interest_area;
                this.roles  = data.roles;
                this.availability_day =data.availability_day;
                this.why_work = data.why_work;
                this.commercial = data.commercial_platform;
                this.experimented = data.experimented_platform;
                this.languages= data.programming_languages;
                this.current_currency = data.current_currency;
                this.current_salary = data.current_salary;

                this.platforms = data.platforms;
               
                if(data.image != null )
                {

                  this.imgPath = data.image;
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
                this.candidateMsgTitle= data[0].page_title;
                this.candidateMsgBody = data[0].page_content;
              }
            });
      }
      else
      {
        this.router.navigate(['/not_found']);
      }

    }



  }

}
