import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-public-profile-link',
  templateUrl: './public-profile-link.component.html',
  styleUrls: ['./public-profile-link.component.css']
})
export class PublicProfileLinkComponent implements OnInit {

 id;user_id;
   first_name;last_name;description;companyname;degreename;
        interest_area;why_work;availability_day;
        countries;commercial;history;education;
        experimented;languages;current_currency;current_salary;image_src;
        imgPath;nationality;contact_number;
    credentials: any = {};
    admin_log;
  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router) 
  {
 
        this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
       // console.log(this.user_id); 
    });
            
  
  }
    currentUser: User;
    info;createdDate;
    approve;verify;is_verify;information;
  ngOnInit() 
  {
      console.log(this.user_id);

        
      if(this.user_id )
      {
          
          this.authenticationService.getById(this.user_id)
            .subscribe(
            data => {
                if(data.error)
                {
                    
                }
                else
                    this.info = data;
                    //this.info.push(data);  
                console.log(data);            
                
               

            });
          
                   
      }
      else
      {
          this.router.navigate(['/not_found']);
          
      }      
      //console.log(this.currentUser._id); 
  }
    
  
}
