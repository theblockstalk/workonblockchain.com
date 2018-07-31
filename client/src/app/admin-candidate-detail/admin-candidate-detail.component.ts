import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
//const URL = 'http://localhost:4000/';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-admin-candidate-detail',
  templateUrl: './admin-candidate-detail.component.html',
  styleUrls: ['./admin-candidate-detail.component.css']
})
export class AdminCandidateDetailComponent implements OnInit {

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
       // //console.log(this.user_id); 
    });
            
  
  }
    currentUser: User;
    info;createdDate;
    approve;verify;is_verify;information;
  ngOnInit() 
  {
      //console.log(this.user_id);

      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
      ////console.log('ftn')
      ////console.log(this.user_id)
      this.credentials.user_id = this.user_id;

      
      if(this.user_id && this.admin_log)
      {
          if(this.admin_log.is_admin == 1)
          {
          this.authenticationService.getById(this.user_id)
            .subscribe(
            data => {
                this.info = data;
                this.approve = data[0]._creator.is_approved;
                this.verify =data[0]._creator.is_verify;
                
                if(data[0].image != null )
                    {
                       /* let x = data[0].image.split("://");
                        //console.log(x[0]);
                        if(x[0] == 'http' || x[0] == 'https')
                        {
                            this.imgPath = data[0].image;
                        }
                        else
                        {
                      ////console.log(data.image);
                       */
                        this.imgPath =  data[0].image;
                        //console.log(this.imgPath);
                        
                    }
                //console.log(this.verify);
                if(this.approve === 1)
                {
                    this.is_approved = "Aprroved";
                }
                
                else
                {
                    this.is_approved = "";
                 }
                
                if(data[0]._creator.refered_id)
                {
                     this.authenticationService.getById(data[0]._creator.refered_id)
                    .subscribe(
                    data => {
                        this.first_name = data[0].first_name;
                        this.last_name =data[0].last_name;
                        });
                
            
                }

            });
          }
           else
            {
                this.router.navigate(['/not_found']);
          
            }           
      }
      else
      {
          this.router.navigate(['/not_found']);
          
      }      
      ////console.log(this.currentUser._id); 
  }
    
  is_approve;is_approved;
    approveClick(event , approveForm: NgForm)
    {
        ////console.log(approveForm.value.id);
         if(event.srcElement.innerHTML ==='Active' )
         {
             this.is_approve = 1;
         }
         else if(event.srcElement.innerHTML ==='Inactive')
         {
             this.is_approve =0;                       
         }
          
             this.authenticationService.aprrove_user(approveForm.value.id ,this.is_approve )
            .subscribe(
                data => 
                {
                    ////console.log(data.is_approved);
                     
                    if(data.is_approved === 1 )
                    {
                        if(event.srcElement.innerHTML ==='Active' )
                        {
                                //// perform add action
                                event.srcElement.innerHTML="Inactive";
                            this.is_approved = "Aprroved";
                        }
                        else if(event.srcElement.innerHTML ==='Inactive')
                        {
                             //// perform remove action
                             event.srcElement.innerHTML="Active"; 
                            this.is_approved = "";                          
                        }
                    } 
                    else if(data.is_approved ===0)
                    {
                        if(event.srcElement.innerHTML ==='Active' )
                        {
                                //// perform add action
                                event.srcElement.innerHTML="Inactive";
                             this.is_approved = "Aprroved";
                        }
                        else if(event.srcElement.innerHTML ==='Inactive')
                        {
                             //// perform remove action
                             event.srcElement.innerHTML="Active"; 
                            this.is_approved = "";                            
                        }
                   }
                    
                });
    }
    
    
}
