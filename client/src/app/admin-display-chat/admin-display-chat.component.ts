import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm,FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-admin-display-chat',
  templateUrl: './admin-display-chat.component.html',
  styleUrls: ['./admin-display-chat.component.css']
})
export class AdminDisplayChatComponent implements OnInit {

    user_id;
    user_type ;
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
    email;
    length;
    company_type;
    admin_log;
    file_url;
    profile_pic;
    display_name;
 constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router) 
  {
 
        this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
        this.user_type = params['type'];
        //console.log(this.user_id); 
            //console.log(this.user_type);
    });
        
   }
  ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
     //localStorage.removeItem('company_type');
      if(this.user_id && this.admin_log)
      {
        if(this.admin_log.is_admin == 1)
        {
         this.get_user_type();
      //this.user_type = 'company';
      ////console.log(this.user_type);
         
       this.count=0;
       if(this.user_type=="company"){
          ////console.log('company');
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
         // //console.log('company');
          this.display_list = 1;
          this.authenticationService.get_user_messages_only(this.user_id)
            .subscribe(
                msg_data => {
                    if(msg_data['datas'].length>0)
                    {
                        this.length = msg_data['datas'].length;
                        ////console.log(msg_data['datas'].length);
                        this.authenticationService.getCandidate('0','0',0,this.type)
                            .subscribe(
                                data => {
                                    //console.log(data);
                                    for (var key in msg_data['datas']) {
                                            for (var key_user in data['users']) {
                                                if(msg_data['datas'][key].sender_id == data['users'][key_user]._creator._id || msg_data['datas'][key].receiver_id == data['users'][key_user]._creator._id){
                                                    if(this.users.indexOf(data['users'][key_user]) === -1){
                                                        //console.log('if');
                                                        this.users.push(data['users'][key_user]);
                                                    }
                                                }   
                                            }
                                        }
                                    //console.log(this.users[0].image);
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
                    else
                    {
                        this.length = 0;
                        //console.log("elseee");
                        
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
                }
            );
        }
        else{
            this.authenticationService.get_user_messages_only(this.user_id)
            .subscribe(
                msg_data => {
                    if(msg_data['datas'].length>0){
                        //console.log('msg_data');
                        this.length = msg_data['datas'].length
                         ////console.log(msg_data['datas'].length);
                        this.authenticationService.getCandidate('0','0',0,'company')
                        .subscribe(
                            data => {
                                //console.log(data['users']);
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
                                //console.log(this.users);
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
                    
                     else
                    {
                        this.length = 0;
                        //console.log("elseee   22");
                        
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
                }
            );
            
            this.display_list = 0;
            ////console.log('candidate');
        }
       }
       else
          this.router.navigate(['/not_found']);  
          
     }
      
     else
     {
           this.router.navigate(['/not_found']);
          
      }
      
  }
    
    openDialog(email: string, id:string){
      
      //this.msgs = 'hi baby';
      this.msgs = '';
      this.new_msgss = '';
      //console.log(id);
     // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log("show_msg_area: " + this.show_msg_area);
        //Observable.interval(10000).subscribe(x => {
         //receiver,sender
         this.authenticationService.get_user_messages(id,this.user_id)
            .subscribe(
                data => {
                    //console.log('data');
                    //console.log(data['datas']);
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
                        if(this.user_type=='candidate'){
                            this.cand_offer = 1;
                            this.credentials.msg_body = 'Yes ! i will join you';
                        }
                        else{
                            this.cand_offer = 0;
                        }
                    }
                    if(data['datas'].length >= 1){
                        this.first_message = 0;
                        this.show_msg_area = 1;
                        if(this.user_type=='candidate' && this.cand_offer == 1){
                            this.credentials.msg_body = 'Yes ! i will join you';
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
            this.candidate = email;
            this.credentials.email = email;
            this.credentials.id = id;
            /*this.credentials.date = '';
            this.credentials.time = '';
            this.credentials.location = '';
            this.credentials.description = '';*/
        //});
    }
    
   
    get_user_type()
    {
    this.authenticationService.getById(this.user_id)
            .subscribe(
            data => {
                //console.log(data);
                ////console.log(data[0]._creator);
                if(data.error)
                {
                    this.log= "Something Went Wrong"; 
                    localStorage.removeItem('company_type');
                }
                if(data!= '')
                {
                    //console.log("iffffffff");
                    //console.log(data[0].image);
                   if(data[0].image!='')
                   {
                       //console.log("candidate image");
                    this.profile_pic = data[0].image;
                    }
                   
                    this.display_name = data[0].first_name+' '+data[0].last_name;
                         this.user_type = data[0]._creator.type;
                        localStorage.removeItem('company_type');
                         //console.log(this.user_type);
                        this.email  = data[0]._creator.email;
                        //console.log(this.email);
                        
                    
                    
                }
                else
                    {
                    ////console.log("else");
                    this.authenticationService.getCurrentCompany(this.user_id)
                        .subscribe(
                        data => 
                        {
                            //console.log(data);
                            if(data.error)
                            {
                                this.log= "Something Went Wrong";
                                localStorage.removeItem('company_type');  
                            }
                            else
                            {
                                //console.log("elseeeee");
                                
                                if(data[0].company_logo!='')
                                {
                                    //console.log("company_logo");
                                     this.profile_pic = data[0].company_logo;
                                     //console.log(this.profile_pic);
                                    }
                               
                               
                                 this.display_name = data[0].company_name;
                                 this.user_type = data[0]._creator.type;
                                 ////console.log(this.user_type);
                                localStorage.setItem("company_type", this.user_type);
                                //localStorage.removeItem('type');
                                 this.email  = data[0]._creator.email;
                                 //console.log(this.email);
                            }
                      
                        },
                        error => 
                        {
                            if(error.message == 500 || error.message == 401)
                                    {
                                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                        window.location.href = '/login';
                                    }
                    
                                     if(error.message == 403)
                                    {
                                            // this.router.navigate(['/not_found']);                        
                                    } 
                  
                         }); 
                    
                    }
                
                });
    
    }
}