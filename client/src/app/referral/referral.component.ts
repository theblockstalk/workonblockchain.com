import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {ProfileDetail} from '../Model/ProfileDetail';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
	currentUser: User;
	
	credentials: any = {};
	email_ref_link = 'http://workonblockchain.mwancloud.com/refer?code=';
	log = '';
	title = 'My Ref Page';
	ref_link = '';
	email_subject = ' thinks that you should Work on Blockchain!';
	mail_body = '';
	show_refreal;
	display_name;
	
	constructor(
		private authenticationService: UserService
	) { }

	ngOnInit(){
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.show_refreal = 1;
		if(this.currentUser){
			this.show_refreal = 10;
			this.authenticationService.getById(this.currentUser._creator)
            .subscribe(
                data => {
                    this.display_name = data[0].first_name+' '+data[0].last_name;
					this.mail_body = 'Hi, \n\nYou have been invited by '+this.display_name+' to join Work on Blockchain. \n\nIt takes seconds to sign up. Work on Blockchain is the easiest way to secure a job in the blockchain space. \n\nGive us a try! \n\nCreate a profile and have blockchain companies apply to you by following this link '+this.ref_link+' \n \nThanks, \nWork on Blockchain team!';
					this.email_subject = this.display_name+this.email_subject;
				},
                error => {
                    console.log('error');
                }
            );
			this.ref_link = this.email_ref_link+this.currentUser.ref_link;
		}
		console.log(this.show_refreal);
	}
	
	send_email() {
		this.log = 'Sending your Email';
		if(this.credentials.email && this.email_subject && this.mail_body){
			this.authenticationService.send_refreal(this.credentials.email, this.email_subject, this.mail_body)
				.subscribe(
					data => {
						console.log('data');
						console.log(data);
						this.log = data;
					},
					error => {
						console.log('error');
						console.log(error);
						this.log = error;
					}
				);
		}
		else{
			console.log('not good');
			this.log = 'Please fill all fields';
		}
	}
	copyInputMessage(inputElement){
		inputElement.select();
		document.execCommand('copy');
		inputElement.setSelectionRange(0, 0);
	}
}
