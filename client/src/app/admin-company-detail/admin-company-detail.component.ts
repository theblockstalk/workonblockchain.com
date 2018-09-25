import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';



@Component({
  selector: 'app-admin-company-detail',
  templateUrl: './admin-company-detail.component.html',
  styleUrls: ['./admin-company-detail.component.css']
})
export class AdminCompanyDetailComponent implements OnInit {

    user_id;
    currentUser: User;
    info=[];
    credentials: any = {};
    approve;
    verify;
    is_approved;
    error;
    is_approve;
    admin_log;  
    imgPath; 
    
  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router) 
  {
    this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
        ////console.log(this.user_id);     
    });
  }

  company_website;
  ngOnInit() 
  {
      ////console.log(this.user_id);
     
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
      //////console.log('ftn')
      //////console.log(this.user_id)
      this.credentials.user_id = this.user_id;

      
      if(this.user_id && this.admin_log.is_admin == 1 )
      {
          this.authenticationService.getCurrentCompany(this.user_id)
            .subscribe(
                data => 
                {
                    ////console.log(data);
                    
                    if(data.error)
                    {
                        this.error= "Something Went Wrong";  
                    }
                    else
                     {
                        this.info.push(data);;
                        this.approve = data._creator.is_approved;
                        this.verify =data._creator.is_verify;
                         if(data.company_logo != null )
                        {                        
                            //////console.log(data.image);                     
                              this.imgPath = data.company_logo;
                            ////console.log(this.imgPath);
                        
                        }
                        
                        if(data.company_website)
                        {    
                            let loc= data.company_website;          
                            let x = loc.split("/");
                            if(x[0] === 'http:' || x[0] === 'https:')
                            {
                                this.company_website = data.company_website;
                            }
                            else
                            {
                                this.company_website = 'http://' + data.company_website;  
                            }
                        }
                        ////console.log(this.verify);
                        if(this.approve === 1)
                        {
                            this.is_approved = "Aprroved";
                        }
                
                        else
                        {
                            this.is_approved = "";
                        }
                     }
                  
                },
                error => 
                {
                  if(error.message === 500 || error.message === 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('googleUser');
                            localStorage.removeItem('close_notify');
                            localStorage.removeItem('linkedinUser');
                            localStorage.removeItem('admin_log'); 
                            window.location.href = '/login';
                        }
                    
                        if(error.message === 403)
                        {
                            // this.router.navigate(['/not_found']);                        
                        } 
                }); 
      }
      else
      {
          this.router.navigate(['/not_found']);
          
      }      
  }
    
   approveClick(event , approveForm: NgForm)
    {
        //////console.log(approveForm.value.id);
        
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
                    //////console.log(data.is_approved);
                     
                    if(data.is_approved === 1 )
                    {
                        ////console.log(approveForm.value);
                        this.authenticationService.approval_email(approveForm.value)
                        .subscribe(
                        data =>
                        {
                            
                            
                        },
                        error =>
                        {
                            if(error.message === 500 || error.message === 401)
                            {
                                    localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                    localStorage.removeItem('currentUser');
                                    localStorage.removeItem('googleUser');
                                    localStorage.removeItem('close_notify');
                                    localStorage.removeItem('linkedinUser');
                                    localStorage.removeItem('admin_log'); 
                                    window.location.href = '/login';
                            }
                    
                            if(error.message === 403)
                            {
                                this.router.navigate(['/not_found']);                        
                             }   
                        });
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
                    
                },
                
                error =>
                {
                    if(error.message === 500 || error.message === 401)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            localStorage.removeItem('currentUser');
                                    localStorage.removeItem('googleUser');
                                    localStorage.removeItem('close_notify');
                                    localStorage.removeItem('linkedinUser');
                                    localStorage.removeItem('admin_log');
                            window.location.href = '/login';
                        }
                    
                        if(error.message === 403)
                        {
                            // this.router.navigate(['/not_found']);                        
                        } 
                 });
    }
}
