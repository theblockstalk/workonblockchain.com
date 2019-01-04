import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';
declare var $:any;

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.css']
})
export class CandidateDetailComponent implements OnInit, AfterViewInit   {
  id;
  user_id;
  first_name;
  last_name;
  description;
  companyname;
  degreename;
  interest_area;
  why_work;
  availability_day;
  countries;
  history;
  education;
  experimented;
  languages;
  current_currency;
  current_salary;
  image_src;
  imgPath;
  nationality;
  contact_number;
  platforms;
  github;
  stack;
  roles;
  expected_salary;
  email;
  currency = ["£ GBP" ,"€ EUR" , "$ USD"];

  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;

  constructor(private dataservice: DataService , private route: ActivatedRoute,private authenticationService: UserService,private router: Router)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
  }
  company_reply; currentUser: User;
  credentials: any = {};
  job_type = ["Part Time", "Full Time"];
  company_name;
  interview_location = '';
  interview_time = '';
  invalidMsg;

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

  cand_data=[];
  commercial;
  commercial_skills;
  formal_skills;
  message;

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 500);
  }
  ngOnInit()
  {
    this.invalidMsg = '';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.removeItem('previousUrl');
    if(this.currentUser && this.user_id && this.currentUser.type === 'company') {
      this.authenticationService.getLastJobDesc()
        .subscribe(
          data => {

            this.credentials.job_title = data['job_title'];
            this.credentials.salary = data['salary'];
            this.credentials.currency = data['salary_currency'];
            this.credentials.location = data['interview_location'];
            this.credentials.job_type = data['job_type'];
            this.credentials.job_desc = data['description'];

          },
          error => {
            if (error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if (error['message'] === 403) {
              this.router.navigate(['/not_found']);
            }
          }
        );

      this.ckeConfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: true,
        removePlugins: 'resize,elementspath',
        removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
      };
      setInterval(() => {
        this.job_offer_msg = '';
      }, 7000);
      this.company_reply = 0;
      this.credentials.user_id = this.user_id;



      this.authenticationService.candidate_detail(this.user_id)
        .subscribe(
          dataa => {
            if (dataa) {
              this.history = dataa['work_history'];
              this.history.sort(this.date_sort_desc);
              this.education = dataa['education_history'];
              this.education.sort(this.education_sort_desc);
              this.cand_data.push(dataa);
              this.first_name = dataa['initials'];
              this.countries = dataa['locations'];
              this.countries.sort();
              if(this.countries.indexOf("remote") > -1){
                this.countries[0] = 'remote';
                this.countries = this.filter_array(this.countries);
              }

              this.interest_area =dataa['interest_area'];
              this.interest_area.sort();
              this.roles  = dataa['roles'];
              this.roles.sort();
              this.commercial = dataa['commercial_platform'];
              if(this.commercial && this.commercial.length>0){
                this.commercial.sort(function(a, b){
                  if(a.platform_name < b.platform_name) { return -1; }
                  if(a.platform_name > b.platform_name) { return 1; }
                  return 0;
                })
              }
              this.experimented = dataa['experimented_platform'];
              if(this.experimented && this.experimented.length>0){
                this.experimented.sort(function(a, b){
                  if(a.name < b.name) { return -1; }
                  if(a.name > b.name) { return 1; }
                  return 0;
                })
              }

              this.languages= dataa['programming_languages'];
              if(this.languages && this.languages.length>0){
                this.languages.sort(function(a, b){
                  if(a.language < b.language) { return -1; }
                  if(a.language > b.language) { return 1; }
                  return 0;
                })
              }

              this.platforms=dataa['platforms'];
              if(this.platforms && this.platforms.length>0){
                this.platforms.sort(function(a, b){
                  if(a.platform_name < b.platform_name) { return -1; }
                  if(a.platform_name > b.platform_name) { return 1; }
                  return 0;
                })
              }
              if(dataa['_creator'].candidate && dataa['_creator'].candidate.blockchain && dataa['_creator'].candidate.blockchain.commercial_skills && dataa['_creator'].candidate.blockchain.commercial_skills.length > 0)
              {
                this.commercial_skills = dataa['_creator']['candidate'].blockchain.commercial_skills;
                this.commercial_skills.sort(function(a, b){
                  if(a.skill < b.skill) { return -1; }
                  if(a.skill > b.skill) { return 1; }
                  return 0;
                })
              }

              if(dataa['_creator'].candidate && dataa['_creator'].candidate.blockchain && dataa['_creator'].candidate.blockchain.formal_skills && dataa['_creator'].candidate.blockchain.formal_skills.length > 0)
              {
                this.formal_skills = dataa['_creator'].candidate.blockchain.formal_skills;
                this.formal_skills.sort(function(a, b){
                  if(a.skill < b.skill) { return -1; }
                  if(a.skill > b.skill) { return 1; }
                  return 0;
                })
              }
            }
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              //console.log(error['error']['message']);
              this.router.navigate(['/not_found']);
            }

          });
      this.authenticationService.getCurrentCompany(this.currentUser._creator)
        .subscribe(
          data => {
            this.company_name = data['company_name'];
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });

    }

    else if(this.currentUser && this.user_id  && this.currentUser.type === 'candidate') {
      this.invalidMsg = "Please log in with an approved company account to view this profile";
    }
    else
    {
      const location = window.location.href.split('/');
      window.localStorage.setItem('previousUrl', location[3]);
      this.router.navigate(['/login']);

    }
  }

  date_of_joining;
  msg_tag;
  is_company_reply = 0;
  msg_body;
  job_offer_msg;
  job_offer_msg_success;
  full_name;
  job_description;
  job_title_log;
  location_log;
  salary_log;
  salary_currency_log;
  employment_log;
  job_desc_log;

  send_job_offer(msgForm : NgForm) {
    this.job_title_log = '';
    this.location_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.employment_log = '';
    this.job_desc_log = '';
    if(!this.credentials.job_title){
      this.job_title_log = 'Please enter job title';
    }
    if(!this.credentials.location){
      this.location_log = 'Please enter location';
    }
    if(!this.credentials.salary){
      this.salary_log = 'Please enter salary';
    }
    if(!this.credentials.currency){
      this.salary_currency_log = 'Please select currency';
    }
    if(!this.credentials.job_type){
      this.employment_log = 'Please select employment type';
    }
    if(!this.credentials.job_desc){
      this.job_desc_log = 'Please enter job description';
    }

    this.full_name = this.first_name;
    if (this.credentials.job_title && this.credentials.location && this.credentials.currency && this.credentials.job_type && this.credentials.job_desc) {
      if (this.credentials.salary && Number(this.credentials.salary) && (Number(this.credentials.salary)) > 0 && this.credentials.salary % 1 === 0) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.authenticationService.get_job_desc_msgs(this.credentials.user_id, 'job_offer')
          .subscribe(
            data => {
              this.job_offer_msg = 'You have already sent a job description to this candidate';
            },
            error => {
              if(error['status'] === 500 || error['status'] === 401)
              {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }

              if(error['status'] === 404)
              {
                this.date_of_joining = '10-07-2018';
                this.msg_tag = 'job_offer';
                this.is_company_reply = 0;
                this.msg_body = '';
                this.job_description = this.credentials.job_desc;
                this.interview_location = this.credentials.location;
                this.authenticationService.insertMessage(this.credentials.user_id, this.company_name, this.full_name, this.msg_body, this.job_description, this.credentials.job_title, this.credentials.salary, this.credentials.currency, this.date_of_joining, this.credentials.job_type, this.msg_tag, this.is_company_reply, this.interview_location, this.interview_time)
                  .subscribe(
                    data => {
                      ////console.log(data);
                      this.job_offer_msg_success = 'Message has been successfully sent';
                      this.router.navigate(['/chat']);
                    },
                    error => {
                      ////console.log('error');
                      ////console.log(error);
                      //this.log = error;
                    }
                  );
              }
            }
          );
      }
      else {
        this.job_offer_msg = 'Salary should be a number';
      }
    }
    else {
      this.job_offer_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }
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
