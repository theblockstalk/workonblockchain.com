import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';

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
        imgPath;nationality;contact_number;
  constructor(private route: ActivatedRoute,private authenticationService: UserService,private router: Router) 
  {
 
        this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
        console.log(this.user_id); 
    });
            
  
  }
  company_reply; currentUser: User;
  credentials: any = {};
  job_type = ["Part Time", "Full Time"];
  ngOnInit() 
  {
      console.log(this.user_id);

      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log('ftn')
      //console.log(this.user_id)
	  this.credentials.user_id = this.user_id;

      
      if(this.user_id)
      {
          this.authenticationService.get_user_messages(this.user_id,this.currentUser._creator)
            .subscribe(
                data => {
                   // console.log('data');
                   // console.log(data['datas']);
                    //this.new_msgss = data['datas'];
                    //this.job_desc = data['datas'][0];
                    if(data['datas'][1]){
                        if(data['datas'][1].is_company_reply==1){
                            console.log('accept')
                            this.company_reply = 1;
                        }
                        else{
                            this.company_reply = 0;
                            
                        }
                    }
                },
                error => {
                    console.log('error');
                    console.log(error);
                    //this.log = error;
                }
            );


          this.authenticationService.getById(this.user_id)
            .subscribe(
            data => {
                console.log(data[0].first_name);
					
					this.first_name=data[0].first_name;
                    this.last_name =data[0].last_name;
                    this.nationality = data[0].nationality;
                    this.contact_number =data[0].contact_number;
                    this.description =data[0].description;
                    this.history =data[0].history;
                    this.education = data[0].education;
                    
					this.credentials.name = this.first_name;
					
                    for(let data1 of data[0].history)
                    {
                        this.companyname = data1.companyname;
                       
                    }
                    for(let edu of data[0].education)
                    {
                        this.degreename = edu.degreename;
                    }
                    this.countries = data[0].country;
                    this.interest_area =data[0].interest_area;
                    this.availability_day =data[0].availability_day;
                    this.why_work = data[0].why_work;
                    this.commercial = data[0].commercial_platform;
                    this.experimented = data[0].experimented_platform;
                    this.languages= data[0].experience_roles;
                    this.current_currency = data[0].current_currency;
                    this.current_salary = data[0].current_salary;
                    if(data.image != null )
                    {
                      //console.log(data.image);
                     this.image_src =  data[0].image ;
                        this.imgPath = '/var/www/html/workonblockchain/server/uploads/';
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
  send_job_offer(msgForm : NgForm){
		console.log(this.credentials);
        if(this.credentials.job_title && this.credentials.salary && this.credentials.location){
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.authenticationService.get_job_desc_msgs(this.currentUser._creator,this.credentials.user_id,'job_offer')
			.subscribe(
				data => {
					console.log(data['datas']);
					if(data['datas'].length>0){
						this.job_offer_msg = 'Message already sent';
					}
					else{
						this.date_of_joining = '10-07-2018';
						this.msg_tag = 'job_offer';
						this.is_company_reply = 0;
						this.msg_body = this.credentials.job_desc;
						this.authenticationService.insertMessage(this.currentUser._creator,this.credentials.user_id,this.currentUser.email,this.credentials.name,this.msg_body,this.credentials.job_title,this.credentials.salary,this.date_of_joining,this.credentials.job_type,this.msg_tag,this.is_company_reply)
							.subscribe(
								data => {
									console.log(data);
									this.job_offer_msg = 'Message sent';
								},
								error => {
									console.log('error');
									console.log(error);
									//this.log = error;
								}
							);
					}
				},
				error => {
					console.log('error');
					console.log(error);
					//this.log = error;
				}
			);
        }
        else{
            this.job_offer_msg = 'Please enter all info';
        }
    }

}
