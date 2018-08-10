import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { Router, ActivatedRoute } from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';
//const URL = 'http://workonblockchain.mwancloud.com:4000/';
//const URL = 'http://localhost:4000/';
import {environment} from '../../environments/environment';

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

    log = '';
    currentUser: User;
    form: FormGroup;
    type = 'candidate';
    credentials: any = {};
    users = [];
    msgs = '';
    new_msgs = '';
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
	unread_msgs : any;
	unread_msgs_info = [];
	new_users = [];
	interview_location = '';
	interview_time = '';
	salary_currency = '';
  constructor(
    private authenticationService: UserService,
    private fb: FormBuilder,
    private el: ElementRef,
    private http: HttpClient,
    private router: Router
  ) {
     this.createForm();
      }
      
    createForm() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            avatar: null
        });
    }

  ngOnInit() {
      this.count=0;
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
                    this.profile_pic = data[0].image;
                    this.display_name = data[0].first_name+' '+data[0].last_name;
                    if(data[0]._creator.is_approved == 0 || data[0].disable_account == true){
                        this.approved_user = 0;
                    }
                    else{
                        this.approved_user = 1;
                    }
                },
                error => {
                    //console.log('error');
                }
            );
        }
        else{
            this.authenticationService.getCurrentCompany(this.currentUser._creator)
            .subscribe(
                data => {
                    //data[0]._creator.is_approved = 1;
                    //data[0].disable_account == false;
                    this.profile_pic = data[0].company_logo;
                    this.display_name = data[0].company_name;
                    if(data[0]._creator.is_approved == 0 || data[0].disable_account == true){
                        this.approved_user = 0;
                    }
                    else{
                        this.approved_user = 1;
                    }
                },
                error => {
                    //console.log('error');
                }
            );
        }
      
        if(this.approved_user == 0){
            //console.log('not allowed');
        }
        else{
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
              this.authenticationService.get_user_messages_only(this.currentUser._creator)
                .subscribe(
                    msg_data => {
                        if(msg_data['datas'].length>0){
                            //console.log(msg_data['datas']);
							this.authenticationService.getCandidate(this.type)
                                .subscribe(
                                    data => {
										for (var key in msg_data['datas']) {
                                            for (var key_user in data['users']) {
                                                if(msg_data['datas'][key].sender_id == data['users'][key_user]._creator._id || msg_data['datas'][key].receiver_id == data['users'][key_user]._creator._id){
													if(msg_data['datas'][key].is_read==0){
														//console.log("Receiver: "+msg_data['datas'][key].receiver_id);
													}
													if(this.users.indexOf(data['users'][key_user]) === -1){
                                                        this.users.push(data['users'][key_user]);
                                                    }
                                                }   
                                            }
                                        }
										this.count = 0;
										for (var key_users_new in this.users) {
											if(this.count == 0){
												this.openDialog(this.users[key_users_new].first_name,this.users[key_users_new]._creator._id);
											}
											this.count = this.count + 1;
											//this.currentUser._creator //receiver
											this.authenticationService.get_unread_msgs_of_user(this.users[key_users_new]._creator._id,this.currentUser._creator)
											.subscribe(
												data => {
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
                    },
                    error => {
                        //console.log('error');
                        //console.log(error);
                    }
                );
            }
            else{
                this.authenticationService.get_user_messages_only(this.currentUser._creator)
                .subscribe(
                    msg_data => {
                        if(msg_data['datas'].length>0){
                            //console.log('msg_data');
                            this.authenticationService.getCandidate('company')
                            .subscribe(
                                data => {
                                    for (var key in msg_data['datas']) {
                                        for (var key_user in data['users']) {
                                            if(msg_data['datas'][key].sender_id == data['users'][key_user]._creator._id){
                                                if(this.users.indexOf(data['users'][key_user]) === -1){
                                                    //console.log('if');
                                                    this.users.push(data['users'][key_user]);
                                                }
                                            }   
                                        }
                                    }
									this.count = 0;
									for (var key_users_new in this.users) {
										if(this.count == 0){
											this.openDialog(this.users[key_users_new].first_name,this.users[key_users_new]._creator._id);
										}
										this.count = this.count + 1;
										//this.currentUser._creator //receiver
										this.authenticationService.get_unread_msgs_of_user(this.users[key_users_new]._creator._id,this.currentUser._creator)
										.subscribe(
											data => {
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
                                    //console.log('error');
                                    //console.log(error);
                                    this.log = error;
                                }
                            );
                        }
                    },
                    error => {
                        //console.log('error');
                        //console.log(error);
                    }
                );
                
                this.display_list = 0;
                //console.log('candidate');
			}
        }
      }
      else{
          this.router.navigate(['/not_found']);
      }
  }
  
  send_message(msgForm : NgForm){
	  if(this.credentials.msg_body && this.credentials.id){
          //console.log(this.credentials);
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
          this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
            .subscribe(
                data => {
                    //console.log(data);
                    this.credentials.msg_body = '';
                    this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
                    .subscribe(
                        data => {
                            //console.log(data['datas']);
                            this.new_msgss = data['datas'];
                            this.job_desc = data['datas'][0];
                            /*this.authenticationService.update_chat_msg_status(this.credentials.id,this.currentUser._creator,0)
                            .subscribe(
                                data => {
                                    //console.log('done');
                                    //console.log(data);
                                },
                                error => {
                                    //console.log('error');
                                    //console.log(error);
                                }
                            );*/
                        },
                        error => {
                            //console.log('error');
                            //console.log(error);
                        }
                    );
                },
                error => {
                    //console.log('error');
                    //console.log(error);
                    //this.log = error;
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
      this.msg_tag = 'normal';
	  this.credentials.msg_body = 'I am not interested';
      this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
        .subscribe(
            data => {
                //console.log(data);
                this.credentials.msg_body = '';
				this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
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
                //console.log('error');
                //console.log(error);
                //this.log = error;
            }
        );
  }
  
  accept_offer(msgForm : NgForm){
      //console.log('accept');
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.is_company_reply = 1;
      this.show_accpet_reject = 4;
      this.msg_tag = 'normal';
	  this.credentials.msg_body = '	I am interested, lets chat!';
      this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
        .subscribe(
            data => {
                //console.log(data);
                this.credentials.msg_body = '';
				this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
				.subscribe(
					data => {
						this.new_msgss = data['datas'];
						this.job_desc = data['datas'][0];
						this.company_reply = 1;
					},
					error => {
						//console.log('error');
						//console.log(error);
					}
				);
            },
            error => {
                //console.log('error');
                //console.log(error);
                //this.log = error;
            }
        );
  }
  
  send_interview_message(msgForm : NgForm){
	  if(this.credentials.date && this.credentials.time && this.credentials.location){
          //console.log('interview');
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          this.is_company_reply = 1;
          this.msg_tag = 'interview_offer';
          this.credentials.msg_body = 'You have been invited for a job interview. Please send message to rsvp.';
          //console.log(this.credentials.msg_body);
		  this.date_of_joining = this.credentials.date.formatted;
          this.interview_location = this.credentials.location;
		  this.interview_time = this.credentials.time;
		  this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
            .subscribe(
                data => {
                    //console.log(data);
					this.date_of_joining = '';
					this.interview_location  = '';
					this.interview_time = '';
                    this.credentials.msg_body = '';
                    this.interview_log = 'Message has been successfully sent';
                    this.credentials.date = '';
                    this.credentials.time = '';
                    this.credentials.location = '';
                    this.credentials.description = '';
					this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
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
                    //console.log('error');
                    //console.log(error);
                    //this.log = error;
                }
            );
        }
        else{
            this.interview_log = 'Please fill all fields';
        }
  }
  
  send_job_message(msgForm : NgForm){
	  if(this.credentials.job_title && this.credentials.base_salary && this.credentials.start_date.formatted){
          //console.log('job offered');
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          this.is_company_reply = 1;
          this.msg_tag = 'job_offered';
          this.is_job_offer = 1;
          this.credentials.msg_body = 'You have been send an employment offer!';
          //console.log(this.credentials.msg_body);
		  this.authenticationService.insert_job_message(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.credentials.job_title,this.credentials.base_salary,this.credentials.currency,this.credentials.start_date.formatted,this.credentials.employment_type,this.msg_tag,this.is_company_reply,this.is_job_offer)
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
					this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
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
                    //console.log('error');
                    //console.log(error);
                    //this.log = error;
                }
            );
      }
      else{
          this.job_offer_log = 'Please enter all info';
      }
  }
  
  accept_job_offer(msgForm1 : NgForm){
      //console.log('accepted');
      //console.log(this.credentials);
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.is_company_reply = 1;
      this.cand_job_offer = 0;
      this.is_job_offer = 2;//2 for accepted
      this.msg_tag = 'job_offer_accepted';
      this.credentials.msg_body = 'I am interested';
      this.authenticationService.update_job_message(this.credentials.job_offer_id,this.is_job_offer)
        .subscribe(
            data => {
                //console.log(data);
                this.authenticationService.insert_job_message(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.is_job_offer)
                    .subscribe(
                        data => {
                            //console.log(data);
                            this.credentials.msg_body = '';
							this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
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
                            //console.log('error');
                            //console.log(error);
                            //this.log = error;
                        }
                    );
            },
            error => {
                //console.log('error');
                //console.log(error);
                //this.log = error;
            }
        );
  }
  
  reject_job_offer(msgForm1 : NgForm){
      //console.log('rejected');
      //console.log(this.credentials);
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.is_company_reply = 1;
      this.cand_job_offer = 0;
      this.is_job_offer = 3;//3 for rejected
      this.msg_tag = 'job_offer_rejected';
      this.credentials.msg_body = 'I am not interested';
      this.authenticationService.update_job_message(this.credentials.job_offer_id,this.is_job_offer)
        .subscribe(
            data => {
                //console.log(data);
                this.authenticationService.insert_job_message(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.salary_currency,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.is_job_offer)
                    .subscribe(
                        data => {
                            //console.log(data);
                            this.credentials.msg_body = '';
							this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
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
                            //console.log('error');
                            //console.log(error);
                            //this.log = error;
                        }
                    );
            },
            error => {
                //console.log('error');
                //console.log(error);
                //this.log = error;
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
  
  openDialog(email: string, id:string){
      //this.msgs = 'hi baby';
      this.msgs = '';
	  this.new_msgss = '';
	  this.credentials.id = id;
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log("show_msg_area: " + this.show_msg_area);
        setInterval(() => {
			//receiver,sender
            //console.log("ID: " + this.credentials.id);
            this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
            .subscribe(
                data => {
                    //console.log('data');
                    //console.log(data['datas']);
                    this.new_msgss = data['datas'];
                    this.job_desc = data['datas'][0];
                    this.authenticationService.update_chat_msg_status(id,this.currentUser._creator,0)
                    .subscribe(
                        data => {
                            //console.log('done');
                            //console.log(data);
                        },
                        error => {
                            //console.log('error');
                            //console.log(error);
                        }
                    );
                    if(this.currentUser.type=='candidate'){
                        this.cand_job_offer = 0;
                        for(var key in data['datas']){
                            if(data['datas'][key].msg_tag == 'job_offered' && data['datas'][key].is_job_offered == 1){
                                this.cand_job_offer = 1;
                                //console.log(this.cand_job_offer);
                                this.credentials.job_offer_id = data['datas'][key]._id;
                                //console.log(data['datas'][key]._id);
                                //console.log('job offered by company');
                            }
                        }
                    }
                    if(data['datas'][1]){
                        if(data['datas'][1].is_company_reply==1){
                            this.company_reply = 1;
                        }
                        else{
                            this.company_reply = 0;
                        }
                    }
                    else{
                        this.company_reply = 0;
                        if(this.currentUser.type=='candidate'){
                            this.cand_offer = 1;
                            this.credentials.msg_body = '';
                        }
                        else{
                            this.cand_offer = 0;
                        }
                    }
                    if(data['datas'].length >= 1){
                        this.first_message = 0;
                        this.show_msg_area = 1;
                        if(this.currentUser.type=='candidate' && this.cand_offer == 1){
                            this.credentials.msg_body = '';
                        }
                        else{
                            //this.credentials.msg_body = '';
                        }
                    }
                    else{
                        this.company_reply = 1;
                        this.cand_offer = 1;
                        this.first_message = 1;
                        this.show_msg_area = 0;
                        this.credentials.msg_body = "";
                    }
                },
                error => {
                    //console.log('error');
                    //console.log(error);
                    //this.log = error;
                }
            );
        }, 2000);
		this.unread_msgs_info = [];
		for (var key_users_new in this.users) {
			//this.currentUser._creator //receiver
			this.authenticationService.get_unread_msgs_of_user(this.users[key_users_new]._creator._id,this.currentUser._creator)
			.subscribe(
				data => {
					this.unread_msgs_info.push(data);
				},
				error => {
					//console.log('error');
					//console.log(error);
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
    upload_file(){
        //console.log("upload file");
        //console.log('rece id: '+this.credentials.id);
        //console.log('rece name: '+this.credentials.email);
        //console.log(this.currentUser);
		//console.log(this.display_name);
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();
        if (fileCount > 0 ) 
        { 
            formData.append('photo', inputEl.files.item(0));
            //console.log(fileCount);
            this.http.post(back_url+'users/upload_chat_file/'+this.currentUser._creator,formData).map((res) => res).subscribe(                
            (success) => 
            {
              //console.log(success);
              this.file_name = success;
              this.msg_tag = 'normal';
              this.credentials.msg_body = 'file ';
              this.authenticationService.send_file(this.currentUser._creator,this.credentials.id,this.display_name,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.date_of_joining,this.job_type,this.msg_tag,this.is_company_reply,this.file_name)
                .subscribe(
                    data => {
                        //console.log(data);
                        this.credentials.msg_body = '';
						this.authenticationService.get_user_messages(this.credentials.id,this.currentUser._creator)
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
                        //console.log('error');
                        //console.log(error);
                        //this.log = error;
                    }
                );
            },
            (error) => console.log(error))
        }

    }
}