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

	/*date(formdata: NgForm)
    {
		//console.log("date");
		//console.log(this.model);
		//console.log(formdata.value);
    }*/
	public loading = false;
    log = '';
    currentUser: User;
    form: FormGroup;
    type = 'candidate';
    credentials: any = {};
    users = [];
    msgs = '';
    new_msgss = '';
    show_msg_area = 1;
    display_list = 0;
    count=0;
    candidate = '';
    job_title = '';
    salary = '';
    date_of_joining = '';
    first_message = 0;
    msg_tag = '';
    job_desc = '';
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
	unread_msgs_info = [];
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
  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '5rem',
      width: '27rem',
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
      //this.msg='';
      //this.approved_user = 1;//use this when code ready this.currentUser.is_approved
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log(this.currentUser);
      //for live
      //this.file_url = 'http://workonblockchainuploads.mwancloud.com/';
      this.file_url = URL;//'http://localhost/workonblockchain.com/server/uploads/';
      if(this.currentUser){
        if(this.currentUser.type == 'candidate'){
            this.authenticationService.getById(this.currentUser._creator)
            .subscribe(
                data => {
                    //data[0]._creator.is_approved = 1;
                    //data[0].disable_account == false;
          					this.profile_pic = data['image'];
                    this.display_name = data['first_name'] +' '+ data['last_name'];
                    /*if(data._creator.is_approved == 0 || data._creator.disable_account == true){
                        this.approved_user = 0;
					}
                    else{
                        this.approved_user = 1;
                    }
                    */

                    if(data['_creator'].candidate.status[0].status === 'created' || data['_creator'].candidate.status[0].status === 'rejected' || data['_creator'].candidate.status[0].status === 'updated' || data['_creator'].candidate.status[0].status === 'wizard completed' || data['_creator'].candidate.status[0].status === 'deferred' || data['_creator'].candidate.status[0].status === 'other')
                    {
                          this.disabled = true;
                          this.msg = "You can access this page when your account has been approved by an admin.";
                          this.log='';
                    }
                    else if(data['_creator'].disable_account == true)
                    {
                        this.disabled = true;
                        this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile";
                        this.log='';

                    }
                    else
                    {
                      this.authenticationService.get_page_content('Candidate chat popup message')
                        .subscribe(
                          data => {
                            if(data)
                            {
                              this.candidateMsgTitle = data[0]['page_title'];
                              this.candidateMsgContent = data[0]['page_content'];

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
                    if(error['message'] === 500 || error['message'] === 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error['message'] === 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
                }
            );
        }
        else{
            this.authenticationService.getCurrentCompany(this.currentUser._creator)
            .subscribe(
                data => {
                    //data[0]._creator.is_approved = 1;
                    //data[0].disable_account == false;
                    this.profile_pic = data['company_logo'];
                    this.display_name = data['company_name'];
					          //console.log(data);
                    /*if(data._creator.is_approved == 0 || data._creator.disable_account == true){
                        this.approved_user = 0;
                    }
                    else{
                        this.approved_user = 1;
                    }*/
                    this.is_approved = data['_creator'].is_approved;
                    this.approved_user = data['_creator'].is_approved;
                    if(data['_creator'].is_approved === 0 )
                    {
                        //console.log("if");
                        this.disabled = true;
                        this.msg = "You can access this page when your account has been approved by an admin.";
                        this.log='';
                    }
                    else if(data['_creator'].disable_account == true)
                    {
                        //console.log("if else");
                        this.disabled = true;
                        this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile";
                        this.log='';

                    }
                    else
                    {
                      this.authenticationService.get_page_content('Company chat popup message')
                        .subscribe(
                          data => {
                            if (data) {
                              this.companyMsgTitle = data[0]['page_title'];
                              this.companyMsgContent = data[0]['page_content'];
                            }
                          }
                        );
                      if(data['_creator'].viewed_explanation_popup === false || !data['_creator'].viewed_explanation_popup){
                        $("#popModal").modal("show");
                      }
                      //console.log("else");
                      this.msg='';
                      this.display_msgs();
                    }
                },
                error => {
                   if(error['message'] === 500 || error['message'] === 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error['message'] === 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
                }
            );
        }
       /* if(this.approved_user == 0){
			this.loading = false;
            //console.log('not allowed');
        }
        else{

        }*/
      }
      else{
          this.router.navigate(['/not_found']);
      }
  }



    display_msgs()
    {
        this.msg='';
        this.loading = false;
            //console.log('allowed');
            if(this.currentUser.type=="company"){
              //console.log('company');
              this.display_list = 1;
              /*this.authenticationService.getCandidate(this.type)
                .subscribe(
                    data => {
                        //console.log('data');
                        this.users = data['users'];
                    },
                    error => {
                        //console.log('error');
                        //console.log(error);
                        this.log = error;
                    }
                );*/
              //below code for only contacted candidates
              //console.log('company');
              this.display_list = 1;
              this.loading = true;
              this.authenticationService.get_user_messages_only(0)
                .subscribe(
                    msg_data => {
                        if(msg_data['datas'].length>0){
                            this.new_messges.push(msg_data['datas']);
                            this.new_messges = this.filter_array(msg_data['datas']);
                            //console.log(this.new_messges);
                            for (var key_messages in this.new_messges) {
                                if(this.currentUser._creator == this.new_messges[key_messages].receiver_id){
                                    //console.log('my');
                                }
                                else{
                                    this.authenticationService.getCandidate('0',this.new_messges[key_messages].receiver_id,this.new_messges[key_messages].is_company_reply,'candidate')
                                    .subscribe(
                                        data => {
                                            this.users.push(data['users']);
                                            //console.log(this.users);
                                            this.count = 0;
                                            for (var key_users_new in this.users) {
                                                //console.log(this.users[key_users_new]._creator._id);
                                                if(this.count == 0){
                                                    if(this.users[key_users_new].first_name){
                                                        this.openDialog(this.users[key_users_new].first_name,this.users[key_users_new]._creator._id,'');
                                                    }
                                                    else{
                                                        this.openDialog(this.users[key_users_new].initials,this.users[key_users_new]._creator._id,'');
                                                    }
                                                }
                                                this.count = this.count + 1;
                                                //this.currentUser._creator //receiver
                                                this.authenticationService.get_unread_msgs_of_user(this.users[key_users_new]._creator._id)
                                                .subscribe(
                                                    data => {
                                                        //console.log(data);
                                                        this.unread_msgs_info.push(data);
                                                    },
                                                    error => {
                                                        //console.log('error');
                                                        //console.log(error);
                                                    }
                                                );
                                            }
                                            //console.log(this.unread_msgs_info);
                                        },
                                        error => {
                                            //console.log('error');
                                            //console.log(error);
                                            this.log = error;
                                        }
                                    );
                                }
                            }
                        }
						else{
                            //this.msg='You have not chatted yet';
							//this.msg='You have not chatted yet';
						}
                    },
                    error => {
                        if(error.status === 500 || error.status === 401)
                        {
                          localStorage.setItem('jwt_not_found', 'Jwt token not found');
                          localStorage.removeItem('currentUser');
                          localStorage.removeItem('googleUser');
                          localStorage.removeItem('close_notify');
                          localStorage.removeItem('linkedinUser');
                          localStorage.removeItem('admin_log');
                          window.location.href = '/login';
                        }

                        if(error.status === 404)
                        {
                          this.log = error.error.message;
                        }
                    }
                );
            }
            else{
                this.authenticationService.get_user_messages_only(0)
                .subscribe(
                    msg_data => {
                        this.loading = false;
                        //console.log(msg_data['datas']);
                        if(msg_data['datas'].length>0){
                            //console.log('this.currentUser._creator: '+this.currentUser._creator);
                            this.new_messges.push(msg_data['datas']);
                            this.new_messges = this.filter_array(msg_data['datas']);
                            //console.log(this.new_messges);
                            for (var key_messages in this.new_messges) {
                                //console.log('length: '+this.new_messges.length);
                                if(this.currentUser._creator == this.new_messges[key_messages].sender_id){
                                    //console.log('my');
                                }
                                else{
                                    this.authenticationService.getCandidate(this.new_messges[key_messages].sender_id,'0',0,'company')
                                    .subscribe(
                                        data => {
                                            this.users.push(data['users']);
                                            //console.log(this.users);
                                            this.count = 0;
                                            for (var key_users_new in this.users) {
                                                if(this.count == 0){
                                                    this.openDialog('',this.users[key_users_new]._creator._id,this.users[key_users_new].company_name);
                                                }
                                                this.count = this.count + 1;
                                                //this.currentUser._creator //receiver
                                                this.authenticationService.get_unread_msgs_of_user(this.users[key_users_new]._creator._id)
                                                .subscribe(
                                                    data => {
                                                        //console.log(data);
                                                        this.unread_msgs_info.push(data);
                                                    },
                                                    error => {
                                                        //console.log('error');
                                                        //console.log(error);
                                                    }
                                                );
                                            }
                                        },
                                        error => {
                                            if(error.message == 500 || error.message == 401)
                                            {
                                                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                                window.location.href = '/login';
                                            }

                                            if(error.message == 403)
                                            {
                                                // this.router.navigate(['/not_found']);
                                            }
                                            this.log = error;
                                        }
                                    );
                                }
                            }
                        }
						else{
							//this.msg='You have not chatted yet';
                            //this.msg='';
						}
                    },
                    error => {
                        if(error.status === 500 || error.status === 401)
                        {
                          localStorage.setItem('jwt_not_found', 'Jwt token not found');
                          localStorage.removeItem('currentUser');
                          localStorage.removeItem('googleUser');
                          localStorage.removeItem('close_notify');
                          localStorage.removeItem('linkedinUser');
                          localStorage.removeItem('admin_log');
                          window.location.href = '/login';
                        }

                        if(error.status === 404)
                        {
                          this.log = error.error.message;
                        }
                    }
                );
                this.display_list = 0;
                //console.log('candidate');
            }

    }
  send_message(msgForm : NgForm){
	  this.interview_log = '';
	  this.job_offer_log = '';
	  this.file_msg = '';
	  this.img_name = '';
	  if(this.credentials.msg_body && this.credentials.id){
          //console.log(this.credentials.email);
          this.msgs = this.msgs+ "\n"+ this.credentials.msg_body;
          //console.log(this.msgs);
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          //sender_id,receiver_id,sender_name,receiver_name,msg
          this.msg_tag = 'normal';
          this.is_company_reply = 1;
          if(this.first_message == 1){
              this.job_title = 'Team Lead';
              this.salary = '60000';
              this.date_of_joining = '10-07-2018';
              this.msg_tag = 'job_offer';
              this.is_company_reply = 0;
              //console.log(this.job_title);
          }
          this.authenticationService.insertMessage(this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.description,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
            .subscribe(
                data => {
                    //console.log(data);
                    this.credentials.msg_body = '';
                    this.authenticationService.get_user_messages(this.credentials.id,0)
                    .subscribe(
                        data => {
                            //console.log(data['datas']);
                            this.new_msgss = data['datas'];
                            this.job_desc = data['datas'][0];

                        },
                        error => {
                            if(error.message == 500 || error.message == 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error.message == 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
                        }
                    );
                },
                error => {
                   if(error.message == 500 || error.message == 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error.message == 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
                }
            );
      }
  }

  reject_offer(msgForm : NgForm){
      //console.log('reject');
      //console.log(this.credentials);
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.credentials.msg_body = 'I am not interested';
      this.is_company_reply = 0;
      this.show_accpet_reject = 3;
      this.msg_tag = 'job_offer_rejected';
	  //console.log(this.credentials.email);
	  this.credentials.msg_body = 'I am not interested';
      this.authenticationService.insertMessage(this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.description,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
        .subscribe(
            data => {
                //console.log(data);
                this.credentials.msg_body = '';
				this.authenticationService.get_user_messages(this.credentials.id,0)
				.subscribe(
					data => {
						this.new_msgss = data['datas'];
						this.job_desc = data['datas'][0];
					},
					error => {
						//console.log('error');
						//console.log(error);
					}
				);
            },
            error => {
                if(error.message == 500 || error.message == 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error.message == 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
            }
        );
  }

  accept_offer(msgForm : NgForm){
      //console.log('accept');
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.is_company_reply = 1;
      this.show_accpet_reject = 4;
      this.msg_tag = 'job_offer_accepted';
	  this.credentials.msg_body = 'I am interested, lets chat!';
      this.authenticationService.insertMessage(this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.description,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
        .subscribe(
            data => {
                //console.log(data);
                this.credentials.msg_body = '';
				this.authenticationService.update_is_company_reply_status(this.is_company_reply)
				.subscribe(
					data => {
						//console.log('good');
					},
					error => {
						if(error.message == 500 || error.message == 401)
						{
							localStorage.setItem('jwt_not_found', 'Jwt token not found');
							window.location.href = '/login';
						}

						if(error.message == 403)
						{
							// this.router.navigate(['/not_found']);
						}
					}
				);
				this.authenticationService.get_user_messages(this.credentials.id,0)
				.subscribe(
					data => {
						this.new_msgss = data['datas'];
						this.job_desc = data['datas'][0];
						this.company_reply = 1;
					},
					error => {
						if(error.message == 500 || error.message == 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error.message == 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
					}
				);
            },
            error => {
                if(error.message == 500 || error.message == 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }

                        if(error.message == 403)
                        {
                            // this.router.navigate(['/not_found']);
                        }
            }
        );
  }

  send_interview_message(msgForm : NgForm) {
    this.interview_log = '';
    this.job_offer_log = '';
    this.file_msg = '';
    this.img_name = '';
    if (this.credentials.date && this.credentials.time && this.credentials.location) {
      $("#myModal").modal("hide");
      //console.log('interview');
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.is_company_reply = 1;
      this.msg_tag = 'interview_offer';
      this.credentials.msg_body = 'You have been invited for a job interview. Please send message to rsvp.';
      this.description = '';
      if (this.credentials.description) {
        this.description = this.credentials.description;
      }
      //console.log(this.credentials.msg_body);
      this.date_of_joining = this.credentials.date.formatted;
      this.interview_location = this.credentials.location;
      this.interview_time = this.credentials.time;
      this.authenticationService.insertMessage(this.credentials.id, this.display_name, this.credentials.email, this.credentials.msg_body, this.description, this.job_title, this.salary, this.salary_currency, this.date_of_joining, this.job_type, this.msg_tag, this.is_company_reply, this.interview_location, this.interview_time)
        .subscribe(
          data => {
            //console.log(data);
            this.date_of_joining = '';
            this.interview_location = '';
            this.interview_time = '';
            this.credentials.msg_body = '';
            this.interview_log = 'Message has been successfully sent';
            this.credentials.date = '';
            this.credentials.time = '';
            this.credentials.location = '';
            this.credentials.description = '';
            this.authenticationService.get_user_messages(this.credentials.id, this.currentUser._creator)
              .subscribe(
                data => {
                  this.new_msgss = data['datas'];
                  this.job_desc = data['datas'][0];
                },
                error => {
                  if (error.message == 500 || error.message == 401) {
                    localStorage.setItem('jwt_not_found', 'Jwt token not found');
                    window.location.href = '/login';
                  }

                  if (error.message == 403) {
                    // this.router.navigate(['/not_found']);
                  }
                }
              );
          },
          error => {
            if (error.message == 500 || error.message == 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              window.location.href = '/login';
            }

            if (error.message == 403) {
              // this.router.navigate(['/not_found']);
            }
          }
        );
    }
    else {
      this.interview_log = 'Please fill all fields';
    }
  }

  send_job_message(msgForm : NgForm) {
    this.interview_log = '';
    this.job_offer_log = '';
    this.file_msg = '';
    this.img_name = '';
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my_aa');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (fileCount > 0) {
      //console.log('file');
      let toArray = inputEl.files.item(0).type.split("/");
      if (inputEl.files.item(0).size <= this.file_size && (toArray[0] === 'image' || inputEl.files.item(0).type === 'application/pdf' || inputEl.files.item(0).type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        formData.append('photo', inputEl.files.item(0));
        //console.log(inputEl.files.item(0));
          if (this.credentials.job_title && this.credentials.start_date && this.credentials.currency && this.credentials.employment_type && this.credentials.job_description) {
            if (this.credentials.base_salary && Number(this.credentials.base_salary) && (Number(this.credentials.base_salary)) > 0 && this.credentials.base_salary % 1 === 0) {
              this.send_employment_offer(this.credentials, 1,formData);
            }
            else {
              this.job_offer_log = 'Salary should be a number';
            }
          }
          else {
            this.job_offer_log = 'Please enter all info';
          }
      }
      else {
        this.job_offer_log = 'Only pdf,image & docx are allowed of size less than 1MB';
      }
    }
    else {
      //console.log('no file');
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
        this.job_offer_log = 'Please enter all info';
      }
    }
  }

  accept_job_offer(msgForm1 : NgForm) {
    //console.log('accepted');
    //console.log(this.credentials);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.is_company_reply = 1;
    this.cand_job_offer = 0;
    this.is_job_offer = 2;//2 for accepted
    this.msg_tag = 'employment_offer_accepted';
    this.credentials.msg_body = 'I accept the employment offer';
    let formData = new FormData();
    formData.append('photo', '');
    formData.append('receiver_id', this.credentials.id);
    formData.append('sender_name', this.display_name);
    formData.append('receiver_name', this.credentials.email);
    formData.append('message', this.credentials.msg_body);
    formData.append('description', this.description);
    formData.append('job_title', this.job_title);
    formData.append('salary', this.salary);
    formData.append('currency', this.salary_currency);
    formData.append('date_of_joining', this.date_of_joining);
    formData.append('job_type', this.job_type);
    formData.append('msg_tag', this.msg_tag);
    formData.append('is_company_reply', '1');
    formData.append('job_offered', '2'); //2 for accepted
    formData.append('file_to_send', '0');
    formData.append('employment_reference_id',this.credentials.job_offer_id);
    this.authenticationService.update_job_message(this.credentials.job_offer_id, this.is_job_offer)
      .subscribe(
        data => {
          //console.log(data);
          this.authenticationService.insert_job_message(formData)
            .subscribe(
              data => {
                //console.log(data);
                this.credentials.msg_body = '';
                this.authenticationService.get_user_messages(this.credentials.id, this.currentUser._creator)
                  .subscribe(
                    data => {
                      this.new_msgss = data['datas'];
                      this.job_desc = data['datas'][0];
                    },
                    error => {
                      if (error.message == 500 || error.message == 401) {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                      }
                      if (error.message == 403) {
                        // this.router.navigate(['/not_found']);
                      }
                    }
                  );
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }

                if (error.message == 403) {
                  // this.router.navigate(['/not_found']);
                }
              }
            );
        },
        error => {
          if (error.message == 500 || error.message == 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if (error.message == 403) {
            // this.router.navigate(['/not_found']);
          }
        }
      );
  }

  reject_job_offer(msgForm1 : NgForm) {
    //console.log('rejected');
    //console.log(this.credentials);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.is_company_reply = 1;
    this.cand_job_offer = 0;
    this.is_job_offer = 3;//3 for rejected
    this.msg_tag = 'employment_offer_rejected';
    this.credentials.msg_body = 'I do not accept the employment offer';
    let file_to_send = '';
    let formData = new FormData();
    formData.append('photo', '');
    formData.append('receiver_id', this.credentials.id);
    formData.append('sender_name', this.display_name);
    formData.append('receiver_name', this.credentials.email);
    formData.append('message', this.credentials.msg_body);
    formData.append('description', this.description);
    formData.append('job_title', this.job_title);
    formData.append('salary', this.salary);
    formData.append('currency', this.salary_currency);
    formData.append('date_of_joining', this.date_of_joining);
    formData.append('job_type', this.job_type);
    formData.append('msg_tag', this.msg_tag);
    formData.append('is_company_reply', '1');
    formData.append('job_offered', '3'); //3 for rejected
    formData.append('file_to_send', '0');
    formData.append('employment_reference_id',this.credentials.job_offer_id);
    this.authenticationService.update_job_message(this.credentials.job_offer_id, this.is_job_offer)
      .subscribe(
        data => {
          //console.log(data);
          this.authenticationService.insert_job_message(formData)
            .subscribe(
              data => {
                //console.log(data);
                this.credentials.msg_body = '';
                this.authenticationService.get_user_messages(this.credentials.id, this.currentUser._creator)
                  .subscribe(
                    data => {
                      this.new_msgss = data['datas'];
                      this.job_desc = data['datas'][0];
                    },
                    error => {
                      if (error.message == 500 || error.message == 401) {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                      }
                      if (error.message == 403) {
                        // this.router.navigate(['/not_found']);
                      }
                    }
                  );
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }

                if (error.message == 403) {
                  // this.router.navigate(['/not_found']);
                }
              }
            );
        },
        error => {
          if (error.message == 500 || error.message == 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }

          if (error.message == 403) {
            // this.router.navigate(['/not_found']);
          }
        }
      );
  }

  /*send_message_candidate(msgForm1 : NgForm){
    if(this.credentials.msg_body){
      //console.log(this.credentials);
      this.new_msgs = this.new_msgs+ "\n"+ this.credentials.msg_body;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log(this.currentUser);
      //sender_id,receiver_id,sender_name,receiver_name,msg
      this.authenticationService.insertMessage_cand(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body)
        .subscribe(
            data => {
                //console.log(data);
                this.credentials.msg_body = '';
            },
            error => {
                //console.log('error');
                //console.log(error);
                //this.log = error;
            }
        );
    }
  }*/

  openDialog(email: string, id:string, selected_company_name:string){
	  if(selected_company_name){
		  email = selected_company_name;
	  }
	  this.loading = true;
      //this.msgs = 'hi baby';
      this.msgs = '';
	  this.new_msgss = '';
	  this.credentials.id = id;
    this.credentials.msg_body = '';
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log("show_msg_area: " + this.show_msg_area);
      setInterval(() => {
        //receiver,sender
        //console.log("ID: " + this.credentials.id);
        this.authenticationService.get_user_messages(this.credentials.id,0)
          .subscribe(
            data => {
              //console.log('data');
              this.new_msgss = data['datas'];
              //console.log(this.new_msgss);
              this.job_desc = data['datas'][0];
              this.authenticationService.update_chat_msg_status(id,0)
                .subscribe(
                  data => {
                    this.loading = false;
                    //console.log('done');
                    //console.log(data);
                  },
                  error => {
                    if (error.message == 500 || error.message == 401) {
                      localStorage.setItem('jwt_not_found', 'Jwt token not found');
                      window.location.href = '/login';
                    }

                    if (error.message == 403) {
                      // this.router.navigate(['/not_found']);
                    }
                  }
                );
              if (this.currentUser.type == 'candidate') {
                this.cand_job_offer = 0;
                for (var key in data['datas']) {
                  if (data['datas'][key].msg_tag == 'employment_offer' && data['datas'][key].is_job_offered == 1) {
                    this.cand_job_offer = 1;
                    //console.log(this.cand_job_offer);
                    this.credentials.job_offer_id = data['datas'][key]._id;
                    //console.log(data['datas'][key]._id);
                    //console.log('job offered by company');
                  }
                }
              }
              if (data['datas'][1]) {
                if (data['datas'][1].is_company_reply == 1) {
                  this.company_reply = 1;
                }
                else {
                  this.company_reply = 0;
                }
              }
              else {
                this.company_reply = 0;
                if (this.currentUser.type == 'candidate') {
                  this.cand_offer = 1;
                  this.credentials.msg_body = '';
                }
                else {
                  this.cand_offer = 0;
                }
              }
              if (data['datas'].length >= 1) {
                this.first_message = 0;
                this.show_msg_area = 1;
                if (this.currentUser.type == 'candidate' && this.cand_offer == 1) {
                  //this.credentials.msg_body = '';
                }
                else {
                  //this.credentials.msg_body = '';
                }
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
              if (error.message == 500 || error.message == 401) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                window.location.href = '/login';
              }

              if (error.message == 403) {
                // this.router.navigate(['/not_found']);
              }
            }
          );
      }, 2000);
		this.unread_msgs_info = [];
		for (var key_users_new in this.users) {
			//this.currentUser._creator //receiver
			this.authenticationService.get_unread_msgs_of_user(this.users[key_users_new]._creator._id)
			.subscribe(
				data => {
					this.unread_msgs_info.push(data);
				},
				error => {
					if(error.message == 500 || error.message == 401)
                                    {
                                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                        window.location.href = '/login';
                                    }

                                     if(error.message == 403)
                                    {
                                            // this.router.navigate(['/not_found']);
                                    }
				}
			);
		}
		//console.log(this.unread_msgs_info);
        this.candidate = email;
        this.credentials.email = email;
        this.credentials.id = id;
        /*this.credentials.date = '';
        this.credentials.time = '';
        this.credentials.location = '';
        this.credentials.description = '';*/

    }

    file_name;
    upload_file() {
      //console.log("upload file");
      //console.log('rece id: '+this.credentials.id);
      //console.log('rece name: '+this.credentials.email);
      //console.log(this.currentUser);
      //console.log(this.display_name);
      this.file_uploaded = 0;
      this.interview_log = '';
      this.job_offer_log = '';
      this.file_msg = '';
      let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
      let fileCount: number = inputEl.files.length;
      let formData = new FormData();
      if (fileCount > 0 && inputEl.files.item(0).size < this.file_size) {
        this.msg_tag = 'normal';
        this.credentials.msg_body = '';
        formData.append('photo', inputEl.files.item(0));
        formData.append('receiver_id', this.credentials.id);
        formData.append('sender_name', this.display_name);
        formData.append('receiver_name', this.credentials.email);
        formData.append('message', this.credentials.msg_body);
        formData.append('job_title', this.job_title);
        formData.append('salary', this.salary);
        formData.append('date_of_joining', this.date_of_joining);
        formData.append('job_type', this.job_type);
        formData.append('msg_tag', this.msg_tag);
        formData.append('is_company_reply', '1');
        //console.log(inputEl.files.item(0).size);
        this.authenticationService.send_file(formData)
        .subscribe(
          data => {
            this.file_uploaded = 1;
            this.authenticationService.get_user_messages(this.credentials.id, this.currentUser._creator)
              .subscribe(
                data => {
                  //console.log(data['datas']);
                  this.new_msgss = data['datas'];
                  this.job_desc = data['datas'][0];
                },
                error => {
                  if (error.message == 500 || error.message == 401) {
                    localStorage.setItem('jwt_not_found', 'Jwt token not found');
                    window.location.href = '/login';
                  }
                  if (error.message == 403) {
                    // this.router.navigate(['/not_found']);
                  }
                }
              );
          },
          error => {
            if (error.message == 500 || error.message == 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              window.location.href = '/login';
            }

            if (error.message == 403) {
              // this.router.navigate(['/not_found']);
            }
          }
        );
      }
      else {
        this.file_uploaded = 1;
        this.file_msg = 'File size should be less than 1MB';
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

	show_file_name(){
		let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#my_aa');
        let fileCount: number = inputEl.files.length;
        if (fileCount > 0)
        {
			this.img_name = inputEl.files.item(0).name;
		}
	}

	send_employment_offer(my_credentials: any,file: any, formData:any) {
    this.authenticationService.get_employment_offer_info(my_credentials.id, 'employment_offer')
    .subscribe(
      data => {
        this.job_offer_log = 'Please ask the candidate to accept or reject the previous employment offer, then you can send a new one';
      },
      error => {
        if (error.status === 500 || error.status === 401) {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }
        if(error.status === 404)
        {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          this.is_company_reply = 1;
          this.msg_tag = 'employment_offer';
          this.is_job_offer = 1;
          this.credentials.msg_body = 'You have been send an employment offer!';
          this.description = my_credentials.job_description;
          formData.append('receiver_id', my_credentials.id);
          formData.append('sender_name', this.display_name);
          formData.append('receiver_name', my_credentials.email);
          formData.append('message', this.credentials.msg_body);
          formData.append('description', this.description);
          formData.append('job_title', my_credentials.job_title);
          formData.append('salary', my_credentials.base_salary);
          formData.append('currency', my_credentials.currency);
          formData.append('date_of_joining', my_credentials.start_date.formatted);
          formData.append('job_type', my_credentials.employment_type);
          formData.append('msg_tag', this.msg_tag);
          formData.append('is_company_reply', '1');
          formData.append('job_offered', this.is_job_offer);
          formData.append('file_to_send', file);
          formData.append('employment_reference_id', '0');
          //console.log(this.credentials.msg_body);
          this.authenticationService.insert_job_message(formData)
            .subscribe(
              data => {
                //console.log(data);
                this.credentials.msg_body = '';
                this.job_offer_log = 'Message has been successfully sent';
                this.credentials.job_title = '';
                this.credentials.base_salary = '';
                this.credentials.currency = '';
                this.credentials.employment_type = '';
                this.credentials.start_date = '';
                this.credentials.job_description = '';
                this.img_name = '';
                $("#Modal").modal("hide");
                this.authenticationService.get_user_messages(this.credentials.id, this.currentUser._creator)
                  .subscribe(
                    data => {
                      this.new_msgss = data['datas'];
                      this.job_desc = data['datas'][0];
                    },
                    error => {
                      if (error.message == 500 || error.message == 401) {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        window.location.href = '/login';
                      }
                      if (error.message == 403) {
                        // this.router.navigate(['/not_found']);
                      }
                    }
                  );
              },
              error => {
                if (error.message == 500 || error.message == 401) {
                  localStorage.setItem('jwt_not_found', 'Jwt token not found');
                  window.location.href = '/login';
                }
                if (error.message == 403) {
                  // this.router.navigate(['/not_found']);
                }
              }
            );
        }
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
	}

  update_status(){
    const status = true;
    this.authenticationService.updateExplanationPopupStatus(status)
      .subscribe(
        data => {
          //console.log(data);
        },
        error => {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            //this.router.navigate(['/not_found']);
          }

        }
      );
  }
}
