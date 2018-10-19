import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.css']
})
export class CandidateDetailComponent implements OnInit {
  id;user_id;
   first_name;last_name;description;companyname;degreename;
        interest_area;why_work;availability_day;
        countries;commercial;history;education;
        experimented;languages;current_currency;current_salary;image_src;
        imgPath;nationality;contact_number;platforms;
    github;
    stack;
    roles;
     expected_currency;
    expected_salary;
    email;
    ckeConfig: any;
    @ViewChild("myckeditor") ckeditor: any;

  constructor(private route: ActivatedRoute,private authenticationService: UserService,private router: Router)
  {

        this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
       ////console.log(this.user_id);
    });


  }
  company_reply; currentUser: User;
  credentials: any = {};
  job_type = ["Part Time", "Full Time"];
  company_name;
  interview_location = '';
  interview_time = '';

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

    rply;cand_data=[];
  ngOnInit()
  {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '15rem',
      width: '23.2rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };
	  setInterval(() => {
		  this.job_offer_msg = '';
	  }, 7000);
      ////console.log(this.user_id);
      this.company_reply = 0;
	  this.credentials.currency = -1;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //////console.log('ftn')
      //////console.log(this.user_id)
	  this.credentials.user_id = this.user_id;
      if(this.user_id) {

        this.authenticationService.candidate_detail(this.user_id)
          .subscribe(
            dataa => {
              if (dataa) {
                this.history = dataa.work_history;
                this.history.sort(this.date_sort_desc);
                this.education = dataa.education_history;
                this.education.sort(this.education_sort_desc);
                this.cand_data.push(dataa);
                console.log(this.cand_data);
              }
            },
            error => {
              if (error.message === 500) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }

              if (error.message === 403) {
                this.router.navigate(['/not_found']);
              }

            });
        this.authenticationService.getCurrentCompany(this.currentUser._creator)
          .subscribe(
            data => {
              this.company_name = data.company_name;
            },
            error => {
              if(error.message === 500 || error.message === 401  )
              {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                window.location.href = '/login';
              }

              if(error.message === 403)
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


  date_of_joining;
  msg_tag;
  is_company_reply = 0;
  msg_body;
  job_offer_log;
  job_offer_msg;
  full_name;
  job_description;
  send_job_offer(msgForm : NgForm){
	    this.full_name = this.first_name;
        ////console.log(this.full_name);
        if(this.credentials.job_title && this.credentials.location && this.credentials.currency && this.credentials.job_type && this.credentials.job_desc){
            if(this.credentials.salary && Number(this.credentials.salary) && (Number(this.credentials.salary))>0 && this.credentials.salary % 1 === 0){
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				this.authenticationService.get_job_desc_msgs(this.credentials.user_id,'job_offer')
				.subscribe(
					data => {
						////console.log(data['datas']);
						if(data['datas'].length>0){
							this.job_offer_msg = 'You have already sent a job description to this candidate';
						}
						else{
							this.date_of_joining = '10-07-2018';
							this.msg_tag = 'job_offer';
							this.is_company_reply = 0;
							this.msg_body = '';
							this.job_description = this.credentials.job_desc;
							this.authenticationService.insertMessage(this.credentials.user_id,this.company_name,this.full_name,this.msg_body,this.job_description,this.credentials.job_title,this.credentials.salary,this.credentials.currency,this.date_of_joining,this.credentials.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
								.subscribe(
									data => {
										////console.log(data);
										this.job_offer_msg = 'Message has been successfully sent';
									},
									error => {
										////console.log('error');
										////console.log(error);
										//this.log = error;
									}
								);
						}
					},
					error => {
						if(error.message === 500)
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
					}
				);
			}
			else{
				this.job_offer_msg = 'Salary should be a number';
			}
        }
        else{
            this.job_offer_msg = 'Please enter all info';
        }
    }

}
