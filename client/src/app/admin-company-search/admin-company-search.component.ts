import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-company-search',
  templateUrl: './admin-company-search.component.html',
  styleUrls: ['./admin-company-search.component.css']
})
export class AdminCompanySearchComponent implements OnInit {

    p: number = 1;
    currentUser: User;
    length;
    info;
    page;
    log;
    rolesData;
    options;
    admin_check = [{name:1 , value:"Active"}, {name:0 , value:"Inactive"}];
    approve;
    msgtags;
    information;
    is_approve;
    select_value='';
	searchWord;
    admin_log;
    is_admin;
    
   constructor(private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }

    ngOnInit() 
    {
        this.length='';
        this.log='';
        this.approve=-1;

        this.rolesData = 
        [
            {id:'job_offer', text:'Job description sent'},
            {id:'is_company_reply', text:'Job description accepted / reject'},
            {id:'interview_offer', text:'Interview request sent'},
            {id:'job_offered', text:'Employment offer sent'},
            {id:'Employment offer accepted / reject', text:'Employment offer accepted / reject'},
           
        ];
      
        this.options = 
        {
            multiple: true,
            placeholder: 'Message Tags',
            allowClear :true
        }
        
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
       
        if(!this.currentUser)
        {
            this.router.navigate(['/login']);
        }
     
        if(this.currentUser && this.admin_log )
        {
            if(this.admin_log.is_admin == 1)
                this.getAllCompanies();
            else
               this.router.navigate(['/not_found']); 
        }
        else
        {
           this.router.navigate(['/not_found']);
          
        }
    }
    
    getAllCompanies()
    {
       this.length=0;
       this.info=[];
          this.authenticationService.allCompanies()
            .subscribe(
                data => 
                {
                 
                   if(data.error)
                        this.log="Something went wrong";
                   else
                   {
                        
                        ////console.log(this.info);
                        for(let res of data)
                        {
                           
                                this.length++;
                                this.info.push(res);
                                
                             
                            
                            ////console.log(this.verify_candidate.length);
                        }
                        
                         if(this.length> 0 )
                         {
                             this.page =this.length;
                             this.log='';
                         }
                         else
                         {
                            this.log= 'Not Found Any Data';
                            this.info=[];
                            
                         }
                         this.length = '';
                        //this.log='';
                      
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
                        console.log(approveForm.value);
                        this.authenticationService.approval_email(approveForm.value)
                        .subscribe(
                        data =>
                        {
                            
                            
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
                                this.router.navigate(['/not_found']);                        
                             }   
                        });
                        if(event.srcElement.innerHTML ==='Active' )
                        {
                                //// perform add action
                                event.srcElement.innerHTML="Inactive";
                        }
                        else if(event.srcElement.innerHTML ==='Inactive')
                        {
                             //// perform remove action
                             event.srcElement.innerHTML="Active";                           
                        }
                    } 
                    else if(data.is_approved ===0)
                    {
                        if(event.srcElement.innerHTML ==='Active' )
                        {
                                //// perform add action
                                event.srcElement.innerHTML="Inactive";
                        }
                        else if(event.srcElement.innerHTML ==='Inactive')
                        {
                             //// perform remove action
                             event.srcElement.innerHTML="Active";                           
                        }
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
    
    onSearchName(f: NgForm)
    {
        this.length=0;
        this.info=[];
        ////console.log(f.value.word);
         this.authenticationService.admin_search_by_name(f.value.word)
            .subscribe(
                data => 
                {
                    ////console.log(data);
                    
                     if(data.error)
                    {
                      
                        this.length='';
                        this.log = data.error;
                        this.info=[];
                        this.page='';
                    }
                    else
                    {
                         this.info=[];
                         this.length=0;
                        // //console.log(this.log);
                       this.information = this.filter_array(data);
                       ////console.log(this.inform.first_name);
                        
                        for(let res of this.information)
                        {    
                                                                          
                                 this.length++; 
                                // //console.log(res);
                                this.info.push(res);
                               
                                                     

                        }
                       
                       
                        if(this.length> 0 )
                        {
                            
                             this.log='';
                             this.page =this.length;
                           
                        }
                        else
                        {
                            this.log= 'Not Found Any Data';
                        }
                        
                
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
    
    
    messagetag_changed(data)
    {
        if(this.select_value  !== data.value)
        {
            this.select_value = data.value;
            // //console.log(data.value);
            console.log(this.select_value);
            this.search(this.select_value);
       }
           
     }
    
    search_approved(event)
    {
         this.approve =event;
        //console.log(this.approve);
        this.search(this.approve);
        
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
    
    search(event)
    { 
        this.length=0;
        this.page =0;
        this.info=[];
        //console.log(this.approve);
        //console.log(this.msgtags);
        
        if(this.approve === -1 && !this.select_value )
        {
            //console.log("iffff both are empty");
            this.getAllCompanies();
            
        }
        else
        {
           
            this.authenticationService.admin_company_filter(this.approve , this.select_value)
            .subscribe(
                data => 
                {

                    if(data.error)
                    {
                       // //console.log(this.info);
                        this.length='';
                        this.log = data.error;
                        this.info=[];
                        this.page='';
                       
                      
                    }
                    else
                    {
                         ////console.log(this.log);
                        this.information = this.filter_array(data);
                       
                        ////console.log(this.inform.first_name);
                        
                        for(let res of this.information)
                        {    
                                                                           
                                 this.length++; 
                                // //console.log(res);
                                this.info.push(res);
                               
                                                      

                        }
                       
                       
                        if(this.length> 0 )
                        {
                            
                             this.log='';
                             this.page =this.length;
                           
                        }
                        else
                        {
                            this.log= 'Not Found Any Data';
                        }
                        
                
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
         
    }
    
    
     reset()
    {
        this.msgtags = '';
        this.select_value='';
        this.approve=-1;
        this.info=[];
        //console.log("reset");
        this.getAllCompanies();
       /* this.msgtags='';
        
       
        
        //console.log(this.select_value);
         
        //this.positionchanged(this.select_value);
        */
       
    }   
    
    
  

}
