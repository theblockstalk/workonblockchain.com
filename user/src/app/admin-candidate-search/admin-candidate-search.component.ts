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
   
   currentUser: User;
  log;info;roleChange;options2;length;page;searchWord;
    credentials: any = {};job_title;
     public rolesData: Array<Select2OptionData>;
    public blockchainData : Array<Select2OptionData>;
  public options: Select2Options;
  public value;
  public current: string;
  
    active;inactive;
   constructor(private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }
 
  ngOnInit() 
  {
      this.length='';
      this.log='';
      this.active="Active";
      this.inactive = "Inactive";
      this.rolesData = 
       [
            {id:'Backend Developer', text:'Backend Developer'},
            {id:'Frontend Developer', text:'Frontend Developer'},
            {id:'UI Developer', text:'UI Developer'},
            {id:'UX Designer', text:'UX Designer'},
            {id:'Fullstack Developer', text:'Fullstack Developer'},
            {id:'Blockchain Developer', text:'Blockchain Developer'},
            {id:'Smart Contract Developer', text:'Smart Contract Developer'},
            {id:'Architect', text:'Architect'},
            {id:'DevOps', text:'DevOps'},
            {id:'Software Tester', text:'Software Tester'},
            {id:'CTO', text:'CTO'},
            {id:'Technical Lead', text:'Technical Lead'},
            {id:'Product Manager', text:'Product Manager'},
            {id:'Intern Developer', text:'Intern Developer'},
            {id:'Researcher ', text:'Researcher '},
      ];
      
    this.blockchainData =
    [
            {id:'Bitcoin', text:'Bitcoin'},
            {id:'Ethereum', text:'Ethereum'},
            {id:'Ripple', text:'Ripple'},
            {id:'Stellar', text:'Stellar'},
            {id:'Hyperledger Fabric', text:'Hyperledger Fabric'},
            {id:'Hyperledger Sawtooth', text:'Hyperledger Sawtooth'},
            {id:'Quorum', text:'Quorum'},
            {id:'Corda', text:'Corda'},
            {id:'EOS', text:'EOS'},
            {id:'NEO', text:'NEO'},
            {id:'Waves', text:'Waves'},
            {id:'Steem', text:'Steem'},
            {id:'Lisk', text:'Lisk'},
            {id:'Quantum', text:'Quantum'},
            {id:'Tezos', text:'Tezos'},
            {id:'Cardano', text:'Cardano'},
            {id:'Litecoin', text:'Litecoin'},
            {id:'Monero', text:'Monero'},
            {id:'ZCash', text:'ZCash'},
            {id:'IOTA', text:'IOTA'},
            {id:'NEM', text:'NEM'},
            {id:'NXT', text:'NXT'},
            {id:'Dash', text:'Dash'},
            {id:'Doge', text:'Doge'},
    ]

    this.options = {
      multiple: true,
      placeholder: 'Position' 
    }
      
      this.options2 = {
      multiple: true,
      placeholder: 'Blockchain experience' 
    } 
    
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(!this.currentUser)
      {
          this.router.navigate(['/login']);
      }
      if(this.currentUser )
      {
            this.getVerrifiedCandidate();
        }
      else
       {
           this.router.navigate(['/not_found']);
          
       }
      
      this.getAllCandidate();

  }
    
  getAllCandidate()
  {
      this.authenticationService.getAll()
            .subscribe(
                data => 
                {
                    console.log(data);
                    
                    });
  }
    
   getVerrifiedCandidate()
    {     
        this.length=0;
          this.authenticationService.getAll()
            .subscribe(
                data => 
                {
                  //console.log(data);
                   if(data)
                        this.info = data;
                        console.log(this.info);
                        for(let res of data)
                        {
                            if(res.first_name && res.roles && res.why_work && res.experience_roles && res.availability_day 
                            && res.nationality && res.last_name  && res.contact_number && res.education && res.history &&  res.platforms 
                            && res.commercial_platform && res.interest_area  && res.country )
                            {
                                this.length++;
                            }
                            //console.log(this.verify_candidate.length);
                        }
                        
                         if(this.length> 0 )
                         {
                             this.page =this.length;
                             this.log='';
                             console.log(this.page);
                             console.log(this.length);
                         }
                         else
                         {
                            this.log= 'Not Found Any Data';
                        
                            
                         }
                         this.length = '';
                        //this.log='';
                        

                       
                    
                 
                },
                error => 
                {
                  
                });
    }
    
    is_approve;
    approveClick(event , approveForm: NgForm)
    {
        //console.log(approveForm.value.id);
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
                    //console.log(data.is_approved);
                     
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
                    
                });
    }

}
