import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

	log = '';
	currentUser: User;
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
  constructor(
	private authenticationService: UserService
  ) { }

  ngOnInit() {
	  this.count=0;
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	    if(this.currentUser.type=="company"){
		  console.log(this.currentUser);
		  console.log('company');
		  this.display_list = 1;
		  this.authenticationService.getCandidate(this.type)
			.subscribe(
				data => {
					console.log('data');
					this.users = data['users'];
				},
				error => {
					console.log('error');
					console.log(error);
					this.log = error;
				}
			);
	    }
		else{
			this.authenticationService.get_user_messages_only(this.currentUser._creator)
			.subscribe(
				msg_data => {
					if(msg_data['datas'].length>0){
						console.log('msg_data');
						this.authenticationService.getCandidate('company')
						.subscribe(
							data => {
								for (var key in msg_data['datas']) {
									for (var key_user in data['users']) {
										if(msg_data['datas'][key].sender_id == data['users'][key_user]._id){
											if(this.users.indexOf(data['users'][key_user]) === -1){
												console.log('if');
												this.users.push(data['users'][key_user]);
											}
										}	
									}
								}
							},
							error => {
								console.log('error');
								console.log(error);
								this.log = error;
							}
						);
					}
				},
				error => {
					console.log('error');
					console.log(error);
				}
			);
			
			this.display_list = 0;
			console.log('candidate');
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
			  console.log(this.job_title);
		  }
		  this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.date_of_joining,this.msg_tag,this.is_company_reply)
			.subscribe(
				data => {
					console.log(data);
					this.credentials.msg_body = '';
				},
				error => {
					console.log('error');
					console.log(error);
					//this.log = error;
				}
			);
	  }
  }
  
  reject_offer(msgForm : NgForm){
	  console.log('reject');
	  console.log(this.credentials);
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	  this.credentials.msg_body = 'rejected';
	  this.is_company_reply = 0;
	  this.msg_tag = 'normal';
	  this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.date_of_joining,this.msg_tag,this.is_company_reply)
		.subscribe(
			data => {
				console.log(data);
				this.credentials.msg_body = '';
			},
			error => {
				console.log('error');
				console.log(error);
				//this.log = error;
			}
		);
  }
  
  accept_offer(msgForm : NgForm){
	  console.log('accept');
	  console.log(this.credentials);
	  /*this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	  this.is_company_reply = 1;
	  this.msg_tag = 'normal';
	  this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body,this.job_title,this.salary,this.date_of_joining,this.msg_tag,this.is_company_reply)
		.subscribe(
			data => {
				console.log(data);
				this.credentials.msg_body = '';
			},
			error => {
				console.log('error');
				console.log(error);
				//this.log = error;
			}
		);*/
  }
  
  /*send_message_candidate(msgForm1 : NgForm){
	if(this.credentials.msg_body){
	  console.log(this.credentials);
	  this.new_msgs = this.new_msgs+ "\n"+ this.credentials.msg_body;
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	  //console.log(this.currentUser);
	  //sender_id,receiver_id,sender_name,receiver_name,msg
	  this.authenticationService.insertMessage_cand(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body)
		.subscribe(
			data => {
				console.log(data);
				this.credentials.msg_body = '';
			},
			error => {
				console.log('error');
				console.log(error);
				//this.log = error;
			}
		);
	}		
  }*/
  
  openDialog(email: string, id:string){
	  //this.msgs = 'hi baby';
	  this.msgs = '';
	  this.new_msgss = '';
	  console.log(id);
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	  console.log("show_msg_area: " + this.show_msg_area);
	    //Observable.interval(10000).subscribe(x => {
		 //receiver,sender
		 this.authenticationService.get_user_messages(id,this.currentUser._creator)
			.subscribe(
				data => {
					console.log('data');
					console.log(data['datas']);
					this.new_msgss = data['datas'];
					this.job_desc = data['datas'][0];
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
							this.credentials.msg_body = 'yes sure baby';
						}
						else{
							this.cand_offer = 0;
						}
					}
					if(data['datas'].length >= 1){
						this.first_message = 0;
						this.show_msg_area = 1;
						if(this.currentUser.type=='candidate' && this.cand_offer == 1){
							this.credentials.msg_body = 'yes sure baby';
						}
						else{
							this.credentials.msg_body = '';
						}
					}
					else{
						this.company_reply = 1;
						this.cand_offer = 1;
						this.first_message = 1;
						this.show_msg_area = 0;
						this.credentials.msg_body = "Hi ! join us";
					}
				},
				error => {
					console.log('error');
					console.log(error);
					//this.log = error;
				}
			);
			this.candidate = email;
			this.credentials.email = email;
			this.credentials.id = id;
	    //});
	}

}
