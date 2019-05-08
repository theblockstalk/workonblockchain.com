import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {NgForm,FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';
import {environment} from '../../../environments/environment';
declare var $: any;

const back_url = environment.backend_url;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public loading = false;
  log = '';
  currentUser: User;
  form: FormGroup;
  type = 'candidate';
  credentials: any = {};
  users = [];
  msgs = '';
  new_msgss : any = {};
  show_msg_area = 1;
  display_list = 0;
  count=0;
  candidate = '';
  job_title = '';
  salary = '';
  date_of_joining = '';
  first_message = 0;
  msg_tag = '';
  job_desc : any = {};
  is_company_reply = 0;
  company_reply = 0;
  cand_offer = 0;
  interview_log = '';
  job_offer_log = '';
  job_type='';
  show_accpet_reject = 0;
  is_job_offer = 0;
  cand_job_offer = 0;
  approved_user;
  file_url;
  profile_pic;
  display_name;
  new_messges = [];
  interview_location = '';
  interview_time = '';
  salary_currency = '';
  description = '';
  date;
  start_year;
  start_month;
  start_day;
  file_uploaded = 5;
  file_msg = '';
  img_name = '';
  file_size = 1048576;
  msg = '';
  public myDatePickerOptions: IMyDpOptions;
  ckeConfig: any;
  ckeConfigInterview: any;
  @ViewChild("myckeditor") ckeditor: any;
  companyMsgTitle = '';
  companyMsgContent = '';
  candidateMsgTitle = '';
  candidateMsgContent = '';
  salary_currency_select = ["£ GBP" ,"€ EUR" , "$ USD"];
  employment_type_select = ["Part time", "Full time", "Contract"];

  constructor(
    private authenticationService: UserService,
    private fb: FormBuilder,
    private el: ElementRef,
    private http: HttpClient,
    private router: Router
  ) {
    this.date = new Date();
    this.start_year = this.date.getFullYear();
    this.start_month = this.date.getMonth() + 1;
    this.start_day = this.date.getDate();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: null
    });
  }

  is_approved;disabled;

  ngAfterViewInit(): void
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 500);
    $("#startdate_datepicker").datepicker({
      startDate: '-1'
    });
    $("#startdate_datepicker_employ").datepicker({
      startDate: '-1'
    });
  }

  ngOnInit() {
    this.credentials.employment_type = -1;
    this.credentials.currency = -1;
    var styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.type = "text/css";
    styles.href = "/assets/css/chat.css";
    document.getElementsByTagName("head")[0].appendChild(styles);

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '5.3rem',
      width: '33rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };

    //for interview
    this.ckeConfigInterview = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '8rem',
      width: '29rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };

    if(this.start_day == 1){}
    else{
      this.start_day = this.start_day-1;
    }
    this.myDatePickerOptions = {
      disableUntil: {year: this.start_year, month: this.start_month, day: this.start_day}
    };

    this.loading = true;
    this.count=0;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.file_url = URL;
    if(this.currentUser){
      if(this.currentUser.type == 'candidate'){
        this.authenticationService.getCandidateProfileById(this.currentUser._id, false)
          .subscribe(
            data => {
              this.profile_pic = data['image'];
              this.display_name = data['first_name'] +' '+ data['last_name'];
              if(!data['first_approved_date']){
                this.disabled = true;
                this.msg = "You can access this page when your account has been approved by an admin.";
                this.log='';
              }
              else if(data['disable_account'] == true)
              {
                this.disabled = true;
                this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile";
                this.log='';
              }
              else{
                this.authenticationService.get_page_content('Candidate chat popup message')
                  .subscribe(
                    data => {
                      if(data){
                        this.candidateMsgTitle = data[0]['page_title'];
                        this.candidateMsgContent = data[0]['page_content'];
                      }
                    }
                  );
                if(data['viewed_explanation_popup'] === false || !data['viewed_explanation_popup']){
                  $("#popModal").modal("show");
                }
                this.msg='';
                this.display_msgs();
              }
            },
            error => {
              if(error['message'] === 500 || error['message'] === 401){
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                window.location.href = '/login';
              }
              if(error['message'] === 403){}
            }
          );
      }
      else{
        this.authenticationService.getCurrentCompany(this.currentUser._id)
          .subscribe(
            data => {
              this.profile_pic = data['company_logo'];
              this.display_name = data['company_name'];
              this.is_approved = data['_creator'].is_approved;
              this.approved_user = data['_creator'].is_approved;
              if(data['_creator'].is_approved === 0 ){
                this.disabled = true;
                this.msg = "You can access this page when your account has been approved by an admin.";
                this.log='';
              }
              else if(data['_creator'].disable_account == true){
                this.disabled = true;
                this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile";
                this.log='';
              }
              else{
                this.authenticationService.get_page_content('Company chat popup message')
                  .subscribe(
                    data => {
                      if (data && data[0]) {
                        this.companyMsgTitle = data[0]['page_title'];
                        this.companyMsgContent = data[0]['page_content'];
                      }
                    }
                  );
                if(data['_creator'].viewed_explanation_popup === false || !data['_creator'].viewed_explanation_popup){
                  $("#popModal").modal("show");
                }
                this.msg='';
                this.display_msgs();
              }
            },
            error => {
              if(error['message'] === 500 || error['message'] === 401){
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                window.location.href = '/login';
              }
              if(error['message'] === 403){}
            }
          );
      }
    }
    else{
      this.router.navigate(['/not_found']);
    }
  }

  display_msgs(){
    this.msg='';
    this.loading = false;
    if(this.currentUser.type=="company"){
      this.display_list = 1;
      this.display_list = 1;
      this.loading = true;
      this.get_messages_for_company();
      setInterval(() => {
        this.get_messages_for_company();
      },7000);
    }
    else{
      this.get_messages_for_candidate();
      setInterval(() => {
        this.get_messages_for_candidate();
      },7000);
    }
  }

  get_messages_for_candidate(){
    let new_msgs = this.new_msgss;
    this.authenticationService.get_user_messages_only_comp()
      .subscribe(
        msg_data => {
          this.loading = false;
          if(msg_data['conversations']){
            this.new_messges.push(msg_data['conversations']);
            this.new_messges = this.filter_array(msg_data['conversations']);
            this.users = this.new_messges;
            for (var key_users_new in this.users) {

              if(this.count === 0){
                this.openDialog('',this.users[key_users_new].user_id,this.users[key_users_new].name,key_users_new);
              }
              if(this.users[key_users_new].unread_count > 0) {
                if(this.users[key_users_new].user_id === new_msgs[0].sender_id) {
                  this.users[key_users_new].unread_count = 0;
                  this.openDialog('',this.users[key_users_new].user_id,this.users[key_users_new].name,key_users_new);

                }
              }

              this.count = this.count + 1;
            }
          }
          else{
            //this.msg='You have not chatted yet';
          }
        },
        error => {
          if(error.status === 500 || error.status === 401){
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          if(error.status === 404){
            this.log = error.error.message;
          }
        }
      );
    this.display_list = 0;
  }

  get_messages_for_company(){
    let new_msgs = this.new_msgss;
    this.authenticationService.get_user_messages_only_comp()
      .subscribe(
        msg_data => {
          if(msg_data['conversations']){
            this.new_messges.push(msg_data['conversations']);
            this.new_messges = this.filter_array(msg_data['conversations']);
            this.users = this.new_messges;
            for (var key_users_new in this.users) {
              if(this.count === 0){
                this.openDialog(this.users[key_users_new].name,this.users[key_users_new].user_id,'',key_users_new);
              }
              if(this.users[key_users_new].unread_count > 0) {
                if(this.users[key_users_new].user_id === new_msgs[0].receiver_id) {
                  this.users[key_users_new].unread_count = 0;
                  this.openDialog(this.users[key_users_new].name,this.users[key_users_new].user_id,'',key_users_new);
                }
              }
              this.count = this.count + 1;
            }

          }
          else{
            //this.msg='You have not chatted yet';
          }
        },
        error => {
          if(error.status === 500 || error.status === 401){
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }
          if(error.status === 404){
            this.log = error.error.message;
          }
        }
      );
  }

  send_message(msgForm : NgForm){
    this.interview_log = '';
    this.job_offer_log = '';
    this.file_msg = '';
    this.img_name = '';
    if(this.credentials.msg_body && this.credentials.id){
      this.msgs = this.msgs+ "\n"+ this.credentials.msg_body;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.msg_tag = 'normal';
      this.is_company_reply = 1;
      let message : any = {};
      message.message = this.credentials.msg_body;
      let new_offer : any = {};
      new_offer.normal = message;
      this.authenticationService.send_message(this.credentials.id,this.msg_tag,new_offer)
        .subscribe(
          data => {
            this.credentials.msg_body = '';
            this.authenticationService.get_user_messages_comp(this.credentials.id)
              .subscribe(
                data => {
                  this.new_msgss = data['messages'];
                },
                error => {
                  if(error.message == 500 || error.message == 401){
                    localStorage.setItem('jwt_not_found', 'Jwt token not found');
                    window.location.href = '/login';
                  }
                  if(error.message == 403){}
                }
              );
          },
          error => {
            if(error.message == 500 || error.message == 401){
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              window.location.href = '/login';
            }
            if(error.message == 403){}
          }
        );
    }
  }

  reject_offer(msgForm : NgForm){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.cand_offer = 0;
    this.credentials.msg_body = 'I am not interested';
    this.is_company_reply = 0;
    this.show_accpet_reject = 3;
    this.msg_tag = 'approach_rejected';
    this.credentials.msg_body = 'I am not interested';
    let approach_rejected : any = {};
    approach_rejected.message = this.credentials.msg_body;
    let new_offer : any = {};
    new_offer.approach_rejected = approach_rejected;
    this.authenticationService.send_message(this.credentials.id,this.msg_tag,new_offer)
      .subscribe(
        data => {
          this.credentials.msg_body = '';
          this.authenticationService.get_user_messages_comp(this.credentials.id)
            .subscribe(
              data => {
                this.new_msgss = data['messages'];
                this.company_reply = 0;
              },
              error => {}
            );
        },
        error => {
          if(error.message == 500 || error.message == 401){
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if(error.message == 403){}
        }
      );
  }

  accept_offer(msgForm : NgForm){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.cand_offer = 0;
    this.is_company_reply = 1;
    this.show_accpet_reject = 4;
    this.msg_tag = 'approach_accepted';
    this.credentials.msg_body = 'I am interested, lets chat!';
    let approach_accepted : any = {};
    approach_accepted.message = this.credentials.msg_body;
    let new_offer : any = {};
    new_offer.approach_accepted = approach_accepted;
    this.authenticationService.send_message(this.credentials.id,this.msg_tag,new_offer)
      .subscribe(
        data => {
          this.credentials.msg_body = '';
          this.authenticationService.get_user_messages_comp(this.credentials.id)
            .subscribe(
              data => {
                this.new_msgss = data['messages'];
                this.company_reply = 1;
              },
              error => {
                if(error.message == 500 || error.message == 401){
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }
                if(error.message == 403){}
              }
            );
        },
        error => {
          if(error.message == 500 || error.message == 401){
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if(error.message == 403){}
        }
      );
  }

  date_log;
  time_log;
  location_log;
  description_log;

  send_interview_message(msgForm : NgForm) {
    this.interview_log = '';
    this.job_offer_log = '';
    this.file_msg = '';
    this.img_name = '';
    this.date_log = '';
    this.time_log = '';
    this.location_log = '';
    this.description_log = '';

    let interview_date = $('#startdate_datepicker').val();
    if(!interview_date){
      this.date_log = 'Please enter date';
    }
    if(!this.credentials.time){
      this.time_log = 'Please enter time';
    }
    if(!this.credentials.location){
      this.location_log = 'Please enter location';
    }
    if(!this.credentials.description){
      this.description_log = 'Please enter details';
    }

    if (interview_date && this.credentials.time && this.credentials.location && this.credentials.description) {
      $("#myModal").modal("hide");
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.is_company_reply = 1;
      this.msg_tag = 'interview_offer';
      this.credentials.msg_body = 'You have been invited for a job interview. Please send message to rsvp.';
      this.description = '';
      this.date_of_joining = interview_date;
      this.interview_location = this.credentials.location;
      this.interview_time = this.credentials.time;
      let interview_offer : any = {};
      interview_offer.location = this.interview_location;
      if (this.credentials.description) {
        interview_offer.description = this.credentials.description;
      }
      interview_offer.date_time = this.date_of_joining+' '+this.interview_time+':00';
      let new_offer : any = {};
      new_offer.interview_offer = interview_offer;
      this.authenticationService.send_message(this.credentials.id,this.msg_tag,new_offer)
        .subscribe(
          data => {
            this.date_of_joining = '';
            this.interview_location = '';
            this.interview_time = '';
            this.credentials.msg_body = '';
            this.interview_log = 'Message has been successfully sent';
            this.credentials.date = '';
            this.credentials.time = '';
            this.credentials.location = '';
            this.credentials.description = '';
            this.authenticationService.get_user_messages_comp(this.credentials.id)
              .subscribe(
                data => {
                  this.new_msgss = data['messages'];
                },
                error => {
                  if (error.message == 500 || error.message == 401) {
                    localStorage.setItem('jwt_not_found', 'Jwt token not found');
                    window.location.href = '/login';
                  }
                  if (error.message == 403) {}
                }
              );
          },
          error => {
            if (error.message == 500 || error.message == 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              window.location.href = '/login';
            }
            if (error.message == 403) {}
          }
        );
    }
    else {
      this.interview_log = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
  }

  job_title_log;
  start_date_log;
  employment_type_log;
  salary_log;
  salary_currency_log;
  job_desc_log;
  job_offer_log_success;
  job_offer_log_error;

  send_job_message(msgForm : NgForm) {
    this.interview_log = '';
    this.job_offer_log = '';
    this.file_msg = '';
    this.img_name = '';
    this.job_title_log = '';
    this.start_date_log = '';
    this.employment_type_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.job_desc_log = '';
    this.job_offer_log_success = '';
    this.job_offer_log_error = '';

    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my_aa');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (fileCount > 0) {
      let toArray = inputEl.files.item(0).type.split("/");
      if (inputEl.files.item(0).size <= this.file_size && (toArray[0] === 'image' || inputEl.files.item(0).type === 'application/pdf' || inputEl.files.item(0).type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        formData.append('photo', inputEl.files.item(0));
        this.credentials.start_date = $('#startdate_datepicker_employ').val();
        if(!this.credentials.start_date){
          this.start_date_log = 'Please enter start date';
        }
        if(!this.credentials.job_title){
          this.job_title_log = 'Please enter job title';
        }
        if(!this.credentials.employment_type){
          this.employment_type_log = 'Please select employment type';
        }
        if(!this.credentials.base_salary){
          this.salary_log = 'Please enter salary';
        }
        if(!this.credentials.currency){
          this.salary_currency_log = 'Please select currency';
        }
        if(!this.credentials.job_description){
          this.job_desc_log = 'Please enter job description';
        }

        if (this.credentials.job_title && this.credentials.start_date && this.credentials.currency && this.credentials.employment_type && this.credentials.job_description) {
          if (this.credentials.base_salary && Number(this.credentials.base_salary) && (Number(this.credentials.base_salary)) > 0 && this.credentials.base_salary % 1 === 0) {
            this.send_employment_offer(this.credentials, 1,formData);
          }
          else {
            this.job_offer_log = 'Salary should be a number';
          }
        }
        else {
          this.job_offer_log = 'One or more fields need to be completed. Please scroll up to see which ones.';
        }
      }
      else {
        this.job_offer_log = 'Only pdf,image & docx are allowed of size less than 1MB';
      }
    }
    else {
      this.credentials.start_date = $('#startdate_datepicker_employ').val();
      if(!this.credentials.start_date){
        this.start_date_log = 'Please enter start date';
      }

      if(!this.credentials.job_title){
        this.job_title_log = 'Please enter job title';
      }
      if(!this.credentials.employment_type){
        this.employment_type_log = 'Please select employment type';
      }
      if(!this.credentials.base_salary){
        this.salary_log = 'Please enter salary';
      }
      if(!this.credentials.currency){
        this.salary_currency_log = 'Please select currency';
      }
      if(!this.credentials.job_description){
        this.job_desc_log = 'Please enter job description';
      }

      if (this.credentials.job_title && this.credentials.start_date && this.credentials.currency && this.credentials.employment_type && this.credentials.job_description) {
        if (this.credentials.base_salary && Number(this.credentials.base_salary) && (Number(this.credentials.base_salary)) > 0 && this.credentials.base_salary % 1 === 0) {
          formData.append('photo', '');
          this.send_employment_offer(this.credentials, 0,formData);
        }
        else {
          this.job_offer_log = 'Salary should be a number';
        }
      }
      else {
        this.job_offer_log = 'One or more fields need to be completed. Please scroll up to see which ones.';
      }
    }
  }

  accept_job_offer(msgForm1 : NgForm) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.is_company_reply = 1;
    this.cand_job_offer = 0;
    this.is_job_offer = 2;//2 for accepted
    this.msg_tag = 'employment_offer_accepted';
    this.credentials.msg_body = 'I accept the employment offer';
    let employment_offer_accepted : any = {};
    employment_offer_accepted.message = this.credentials.msg_body;
    employment_offer_accepted.employment_offer_message_id = this.credentials.job_offer_id;
    let new_offer : any = {};
    new_offer.employment_offer_accepted = employment_offer_accepted;

    this.authenticationService.send_message(this.credentials.id,this.msg_tag,new_offer)
      .subscribe(
        data => {
          this.credentials.msg_body = '';
          this.authenticationService.get_user_messages_comp(this.credentials.id)
            .subscribe(
              data => {
                this.new_msgss = data['messages'];
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }
                if (error.message == 403) {}
              }
            );
        },
        error => {
          if (error.message == 500 || error.message == 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error.message == 403) {}
        }
      );
  }

  reject_job_offer(msgForm1 : NgForm) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.is_company_reply = 1;
    this.cand_job_offer = 0;
    this.is_job_offer = 3;//3 for rejected
    this.msg_tag = 'employment_offer_rejected';
    this.credentials.msg_body = 'I do not accept the employment offer';
    let employment_offer_rejected : any = {};
    employment_offer_rejected.message = this.credentials.msg_body;
    employment_offer_rejected.employment_offer_message_id = this.credentials.job_offer_id;
    let new_offer : any = {};
    new_offer.employment_offer_rejected = employment_offer_rejected;
    this.authenticationService.send_message(this.credentials.id,this.msg_tag,new_offer)
      .subscribe(
        data => {
          this.credentials.msg_body = '';
          this.authenticationService.get_user_messages_comp(this.credentials.id)
            .subscribe(
              data => {
                this.new_msgss = data['messages'];
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }
                if (error.message == 403) {}
              }
            );
        },
        error => {
          if (error.message == 500 || error.message == 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error.message == 403) {}
        }
      );
  }

  openDialog(email: string, id:string, selected_company_name:string, usersIndex: string){
    if(selected_company_name){
      email = selected_company_name;
    }
    this.loading = true;
    this.msgs = '';
    this.new_msgss = '';
    this.credentials.id = id;
    this.credentials.msg_body = '';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.authenticationService.get_user_messages_comp(this.credentials.id)
      .subscribe(
        data => {
          this.new_msgss = data['messages'];
          this.job_desc = data['messages'][0].message.approach;
          this.authenticationService.update_chat_msg_status_new(id)
            .subscribe(
              data => {
                this.loading = false;
                this.users[usersIndex].unread_count = 0;
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }
                if (error.message == 403) {}
              }
            );
          if (this.currentUser.type === 'candidate') {
            this.cand_job_offer = 0;
            for (var key in data['messages']) {
              if (data['messages'][key].msg_tag === 'employment_offer') {
                this.cand_job_offer = 1;
                this.credentials.job_offer_id = data['messages'][key]._id;
              }
              if (data['messages'][key].msg_tag === 'employment_offer_accepted' || data['messages'][key].msg_tag === 'employment_offer_rejected') {
                this.cand_job_offer = 0;
              }
            }
          }

          if (data['messages'].length > 1) {
            this.company_reply = 0;
            if(data['messages'][1]['msg_tag'] === 'approach_accepted') this.company_reply = 1;
            this.cand_offer = 0;
          }
          else{
            this.company_reply = 0;
            if (this.currentUser.type === 'candidate') {
              this.cand_offer = 1;
              this.credentials.msg_body = '';
            }
            else {
              this.cand_offer = 0;
            }
          }
          if (data['messages'].length >= 1) {
            this.first_message = 0;
            this.show_msg_area = 1;
            if (this.currentUser.type === 'candidate' && this.cand_offer === 1) {}
            else {}
          }
          else {
            this.company_reply = 1;
            this.cand_offer = 1;
            this.first_message = 1;
            this.show_msg_area = 0;
            this.credentials.msg_body = "";
          }
        },
        error => {
          if (error.message === 500 || error.message === 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error.message === 403) {}
        }
      );
    this.candidate = email;
    this.credentials.email = email;
    this.credentials.id = id;
  }

  file_name;
  upload_file() {
    this.file_uploaded = 0;
    this.interview_log = '';
    this.job_offer_log = '';
    this.file_msg = '';
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (fileCount > 0 && inputEl.files.item(0).size < this.file_size) {
      this.msg_tag = 'file';
      this.credentials.msg_body = '';
      formData.append('photo', inputEl.files.item(0));
      formData.append('receiver_id', this.credentials.id);
      formData.append('msg_tag', this.msg_tag);
      this.authenticationService.send_file(formData)
        .subscribe(
          data => {
            this.authenticationService.get_user_messages_comp(this.credentials.id)
              .subscribe(
                data => {
                  this.file_uploaded = 1;
                  this.new_msgss = data['messages'];
                },
                error => {
                  if (error.message == 500 || error.message == 401) {
                    localStorage.setItem('jwt_not_found', 'Jwt token not found');
                    window.location.href = '/login';
                  }
                  if (error.message == 403) {}
                }
              );
          },
          error => {
            if (error.message == 500 || error.message == 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              window.location.href = '/login';
            }
            if (error.message == 403) {}
          }
        );
    }
    else {
      this.file_uploaded = 1;
      this.file_msg = 'File size should be less than 1MB';
    }
  }

  filter_array(arr){
    let hashTable = {};
    return arr.filter(function (el) {
      let key = JSON.stringify(el);
      let match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

  show_file_name(){
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my_aa');
    let fileCount: number = inputEl.files.length;
    if (fileCount > 0){
      this.img_name = inputEl.files.item(0).name;
    }
  }

  send_employment_offer(my_credentials: any,file: any, formData:any) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.is_company_reply = 1;
    this.msg_tag = 'employment_offer';
    this.is_job_offer = 1;
    this.credentials.msg_body = '';
    this.description = my_credentials.job_description;
    formData.append('receiver_id', my_credentials.id);
    formData.append('description', this.description);
    formData.append('title', my_credentials.job_title);
    formData.append('salary', my_credentials.base_salary);
    formData.append('salary_currency', my_credentials.currency);
    formData.append('start_date', my_credentials.start_date);
    formData.append('type', my_credentials.employment_type);
    formData.append('msg_tag', this.msg_tag);
    this.authenticationService.send_file(formData)
      .subscribe(
        data => {
          this.credentials.msg_body = '';
          this.job_offer_log_success = 'Message has been successfully sent';
          this.credentials.job_title = '';
          this.credentials.base_salary = '';
          this.credentials.currency = '';
          this.credentials.employment_type = '';
          this.credentials.start_date = '';
          this.credentials.job_description = '';
          this.img_name = '';
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 900);
          $("#Modal").modal("hide");
          this.authenticationService.get_user_messages_comp(this.credentials.id)
            .subscribe(
              data => {
                this.new_msgss = data['messages'];
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }
                if (error.message == 403) {}
              }
            );
        },
        error => {
          this.credentials.msg_body = '';
          if (error['status'] === 400) {
            this.job_offer_log_error = 'Please ask the candidate to accept or reject the previous employment offer, then you can send a new one';
          }
          if (error.message == 500 || error.message == 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error.message == 403) {}
        }
      );
  }

  reset_msgs(){
    this.date_of_joining = '';
    this.interview_location  = '';
    this.interview_time = '';
    this.interview_log = '';
    this.credentials.date = '';
    this.credentials.time = '';
    this.credentials.location = '';
    this.credentials.description = '';
    this.credentials.msg_body = '';
    this.job_offer_log = '';
    this.credentials.job_title = '';
    this.credentials.base_salary = '';
    this.credentials.currency = '';
    this.credentials.employment_type = '';
    this.credentials.start_date = '';
    this.credentials.job_description = '';
    this.img_name = '';
    this.date_log = '';
    this.time_log = '';
    this.location_log = '';
    this.job_title_log = '';
    this.start_date_log = '';
    this.employment_type_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.job_desc_log = '';
    this.description_log = '';
    this.job_offer_log_success = '';
    this.job_offer_log_error = '';
  }

  update_status(){
    const status = true;
    this.authenticationService.updateExplanationPopupStatus(status)
      .subscribe(
        data => {
        },
        error => {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false){}
        }
      );
    $("#popModal").modal("hide");

  }

}
