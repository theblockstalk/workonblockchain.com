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
		  //console.log(this.credentials.msg_body);
		  this.msgs = this.msgs+ "\n"+ this.credentials.msg_body;
		  //console.log(this.msgs);
		  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		  //sender_id,receiver_id,sender_name,receiver_name,msg
		  this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body)
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
  send_message_candidate(msgForm1 : NgForm){
	if(this.credentials.msg_body){
	  console.log(this.credentials);
	  this.new_msgs = this.new_msgs+ "\n"+ this.credentials.msg_body;
	  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	  //console.log(this.currentUser);
	  //sender_id,receiver_id,sender_name,receiver_name,msg
	  this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.id,this.currentUser.email,this.credentials.email,this.credentials.msg_body)
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
					if(data['datas'].length >= 1){
						this.show_msg_area = 1;
						this.credentials.msg_body = '';
					}
					else{
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
		  this.credentials.email = email;
		  this.credentials.id = id;
	    //});
	}

}
