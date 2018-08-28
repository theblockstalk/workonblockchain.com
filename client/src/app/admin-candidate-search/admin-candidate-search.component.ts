import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-candidate-search',
  templateUrl: './admin-candidate-search.component.html',
  styleUrls: ['./admin-candidate-search.component.css']
})
export class AdminCandidateSearchComponent implements OnInit {
    p: number = 1;
   currentUser: User;
  log;info=[];roleChange;options2;length;page;searchWord;
    credentials: any = {};job_title;
     public rolesData: Array<Select2OptionData>;
    public blockchainData : Array<Select2OptionData>;
  public options: Select2Options;
  public value;
  public current: string;
  
    active;inactive;approve;
    search_result = [];
    admin_check = [{name:1 , value:"Active"}, {name:0 , value:"Inactive"}];
    information;
    admin_log;
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
      
   

    this.options = {
      multiple: true,
      placeholder: 'Message Tags' 
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
            this.getAllCandidate();
          else
              this.router.navigate(['/not_found']);
        }
      else
       {
           this.router.navigate(['/not_found']);
          
       }
      
      //this.getAllCandidate();

  }
    
   getAllCandidate()
    {          
        this.length=0;
       this.info=[];
          this.authenticationService.getAll()
            .subscribe(
                data => 
                {
                  ////console.log(data);
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
                        this.information = this.filter_array(data);
                        this.info=[];
                        this.length='';
                         ////console.log(this.log);
                        
                       // this.info = this.information; 
                        
                        for(let res of this.information)
                        {
                          
                               
                                  this.length++;
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
                        
                          this.length='';
                                        
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
       //console.log(this.info);
    }
    
    is_approve;
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
                 
                error=>
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
        ////console.log(f.value.word);
        this.length=0;
        this.info=[];
         this.authenticationService.searchByName(f.value.word)
            .subscribe(
                data => 
                {
               
                     if(data.error)
                    {
                      
                         this.length='';
                        this.log = data.error;
                        this.info=[];
                        this.page='';
                    }
                    else
                    {

                        this.information = this.filter_array(data);
                        for(let res of this.information)
                        {
                           
                            
                                  this.length++;
                                this.info.push(res);
                            

                        }
                       
                        if(this.length> 0 )
                        {
                            
                             this.log='';
                        }
                        else
                        {
                            this.log= 'Not Found Any Data';
                        }
                        
                        this.page =this.length; 
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
    
    msgtags;
    messagetag_changed(data)
    {
          this.msgtags = data.value;
           // //console.log(data.value);
          this.search(this.msgtags);
        //console.log(this.msgtags);
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

        this.length =0;
        this.info=[];
        if(this.approve == -1 && !this.msgtags  )
        {             
            //console.log("iffffffff"); 
             this.getAllCandidate();
        }
               
        else
        { 

            //console.log("else");
            this.authenticationService.admin_candidate_filter(this.approve , this.msgtags)
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
                        this.information = this.filter_array(data);

                         ////console.log(this.log);
                        
                       // this.info = this.information; 
                        
                        for(let res of this.information)
                        {
                            
                               
                                  this.length++;
                                this.info.push(res);
                            

                        }
                       
                        if(this.length> 0 )
                        {
                            
                             this.log='';
                        }
                        else
                        {
                            this.log= 'Not Found Any Data';
                        }
                        
                        this.page =this.length;   
                                        
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
    
    select_value;
    reset()
    {
        this.msgtags = '';
        this.select_value='';
        this.approve=-1;
        this.info=[];
        //console.log("reset");
        this.getAllCandidate();
       /* this.msgtags='';
        
       
        
        //console.log(this.select_value);
         
        //this.positionchanged(this.select_value);
        */
       
    }

}
