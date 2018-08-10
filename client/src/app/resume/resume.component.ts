import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
//declare var synapseThrow: any;
//import { synapseThrow } from '../wob';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  
  experimented_platform = [];
  commercially_worked = [];
  expYear=[];
  platform=[];expYear_db=[];db_experimented_platform=[];exp_platform_yr=[];exp_db=[];
  referringData;value;why_work;count=0;exp_class;exp_db_json;exp_data;
  currentUser: User;checked_value;selected_value;commercial_expYear=[];db_valye=[];db_lang;
  exp_db_lang;exp_db_valye=[];exp_expYear=[];
  platforms_designed=[];platforms=[];plat_db_valye=[];
  active_class;
  job_active_class;
  exp_active_class;resume_active_class;resume_class;
  platformreferringData;designed_expYear_db=[];
  term_active_class;term_link;
    exp_disable;

   constructor(private route: ActivatedRoute, private http: HttpClient,
        private router: Router,
        private authenticationService: UserService) { }

  ngOnInit()
  {
     this.exp_disable = "disabled";       
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   
       if(!this.currentUser)
       {
          this.router.navigate(['/login']);
       }
       if(this.currentUser && this.currentUser.type=='candidate')
       {
          // new synapseThrow();
          this.exp_class="";
           this.active_class="fa fa-check-circle text-success";
           this.authenticationService.getById(this.currentUser._id)
            .subscribe(
                data => {

                if(data.terms==true)
                  {
                      this.term_active_class='fa fa-check-circle text-success';
                     this.term_link = '/terms-and-condition';
                  }
               ////console.log(data);
                if(data.commercial_platform || data.experimented_platform || data.why_work || data.platforms)
                {
                  this.why_work=data.why_work;

                    if(data.commercial_platform)
                    {
                        this.commercial_expYear =data.commercial_platform;
                     for (let key of data.commercial_platform) 
                      {
                        for(var i in key)
                        {


                          for(let option of this.commercially)
                          {
                            
                            if(option.value == key[i])
                            {
                              option.checked=true;
                              this.db_valye.push(key[i]);
                              this.db_lang= ({value: key[i]});
                              this.commercially_worked.push(this.db_lang);
                              
                            }
                            else
                            {

                            }
                       
                          }

                          for(let option of this.exp_year)
                          {

                            if(option.value == key[i])
                            {
                                option.checked=true;
                              
                                //this.commercial_expYear.push(option);
                                this.expYear_db.push(key[i]);
                                ////console.log(this.expYear_db); 
                                 
                            }
                       
                          }
                          
                        }
                      }
                     }

                      if(data.platforms)
                      {
                          this.platforms = data.platforms;
                       for (let key of data.platforms) 
                      {
                        for(var i in key)
                        {


                          for(let option of this.designed)
                          {
                            
                            if(option.value == key[i])
                            {
                              option.checked=true;
                              this.plat_db_valye.push(key[i]);
                              this.db_lang= ({value: key[i]});
                              this.platforms_designed.push(this.db_lang);
                              
                            }
                            else
                            {

                            }
                       
                          }

                          for(let option of this.exp_year)
                          {

                            if(option.value == key[i])
                            {
                                option.checked=true;
                                   
                                
                                this.designed_expYear_db.push(key[i]);
                                
                                 
                            }
                       
                          }
                          
                        }
                      }
                     }

                     
                      if(data.experimented_platform)
                      {
                          for (let plat of data.experimented_platform) 
                     {
                      
                      for(let option of this.experimented)
                      {

                        if(option.value == plat.value)
                        {
                          option.checked=true;
                          this.experimented_platform.push(plat);
                          
                        }
                       
                      }
                      
                    }
                    // this.expYear = data.experimented_platform;                        
                    /* for (let key of data.experimented_platform) 
                      {
                        for(var i in key)
                        {


                          for(let option of this.experimented)
                          { 
                            
                            if(option.value == key[i])
                            {
                              option.checked=true;
                              this.exp_db_valye.push(key[i]);
                              this.exp_db_lang= ({value: key[i]});
                              this.experimented_platform.push(this.exp_db_lang);
                              
                            }
                            else
                            {

                            }
                       
                          }

                          
                          for(let option of this.exp_year)
                          {

                            if(option.value == key[i])
                            {
                                option.checked=true;
                                   
                                //this.expYear.push(option);
                                this.exp_expYear.push(key[i]);
                                                           
                            }
                       
                          }
                          
                        }
                      }*/
                    }


                }

                if(data.locations && data.roles && data.interest_area || data.expected_salary || data.availability_day )
                  {
                      this.job_active_class = 'fa fa-check-circle text-success';
                       
                  }
               
              if(data.why_work  )
              {
                this.exp_class = "/experience";
                 this.exp_disable = "";   
                this.resume_active_class='fa fa-check-circle text-success';
               // this.router.navigate(['/resume']);
              }
     
              if( data.experience_roles && data.current_salary )
              {
                  
                  this.exp_active_class = 'fa fa-check-circle text-success';
                  //this.router.navigate(['/experience']);
              }

                            
              
                },
                error => {
                  //this.log = 'Something getting wrong';
                   
                });
          //this.router.navigate(['/about']);
       }
       else
       {
              this.router.navigate(['/not_found']);         
       }
       

  }

 
    
  commercially=
  [ 
    {name:'Bitcoin', value:'Bitcoin', checked:false},
    {name:'Ethereum', value:'Ethereum', checked:false},
    {name:'Ripple', value:'Ripple', checked:false},
    {name:'Stellar', value:'Stellar', checked:false},
    {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
    {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
    {name:'Quorum', value:'Quorum', checked:false},
    {name:'Corda', value:'Corda', checked:false},
    {name:'EOS', value:'EOS', checked:false},
    {name:'NEO', value:'NEO', checked:false},
    {name:'Waves', value:'Waves', checked:false},
    {name:'Steem', value:'Steem', checked:false},
    {name:'Lisk', value:'Lisk', checked:false},
    {name:'Quantum', value:'Quantum', checked:false},
    {name:'Tezos', value:'Tezos', checked:false},
    {name:'Cardano', value:'Cardano', checked:false},
    {name:'Litecoin', value:'Litecoin', checked:false},
    {name:'Monero', value:'Monero', checked:false},
    {name:'ZCash', value:'ZCash', checked:false},
    {name:'IOTA', value:'IOTA', checked:false},
    {name:'NEM', value:'NEM', checked:false},
    {name:'NXT', value:'NXT', checked:false},
    
  ]

  designed=
  [
     {name:'Bitcoin', value:'Bitcoin', checked:false},
    {name:'Ethereum', value:'Ethereum', checked:false},
    {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
    {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
    {name:'Quorum', value:'Quorum', checked:false},
     {name:'Corda', value:'Corda', checked:false},
    {name:'Waves', value:'Waves', checked:false},
    {name:'NEO', value:'NEO', checked:false},
    {name:'EOS', value:'EOS', checked:false},
    {name:'Lisk', value:'Lisk', checked:false},
    {name:'Quantum', value:'Quantum', checked:false},
    {name:'Cardano', value:'Cardano', checked:false},
    {name:'NEM', value:'NEM', checked:false},
    {name:'NXT', value:'NXT', checked:false},
  ]

  experimented=
  [
      {name:'Bitcoin', value:'Bitcoin', checked:false},
      {name:'Ethereum', value:'Ethereum', checked:false},
      {name:'Ripple', value:'Ripple', checked:false},
      {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
      {name:'Corda', value:'Corda', checked:false},
      {name:'EOS', value:'EOS', checked:false},
      {name:'Waves', value:'Waves', checked:false},
      {name:'Steem', value:'Steem', checked:false},
      {name:'Lisk', value:'Lisk', checked:false},
      {name:'Quantum', value:'Quantum', checked:false},
      {name:'Tezos', value:'Tezos', checked:false},
      {name:'Cardano', value:'Cardano', checked:false},
      {name:'Litecoin', value:'Litecoin', checked:false},
      {name:'Monero', value:'Monero', checked:false},
      {name:'ZCash', value:'ZCash', checked:false},
      {name:'IOTA', value:'IOTA', checked:false},
      {name:'NEM', value:'NEM', checked:false},
      {name:'NXT', value:'NXT', checked:false},
      {name:'Dash', value:'Dash', checked:false},
      {name:'Doge', value:'Doge', checked:false},
  ]


  exp_year=
  [
    {name:'0-1', value:'0-1', checked:false},
    {name:'1-2', value:'1-2', checked:false},
    {name:'2-4', value:'2-4', checked:false},
    {name:'4-6', value:'4-6', checked:false},
    {name:'6+', value:'6+', checked:false}
  ]

 

  onExpOptions(obj)
  {

      let updateItem = this.experimented_platform.find(this.findIndexToUpdate, obj.value);
      let index = this.experimented_platform.indexOf(updateItem);
      if(index > -1)
      {
        this.experimented_platform.splice(index, 1);
        
      }
      else
      {
        obj.checked =true;
        this.experimented_platform.push(obj);
      }

      
      /* let updateItem = this.experimented_platform.find(this.findIndexToUpdate, obj.value);
      let index = this.experimented_platform.indexOf(updateItem);
      if(index > -1)
      {
        this.experimented_platform.splice(index, 1);
          let updateItem2 = this.findObjectByKey(this.expYear, 'experimented_platform', obj.value);
       ////console.log(updateItem);
      let index2 = this.expYear.indexOf(updateItem2);

      if(index2 > -1)
      {
          
        this.expYear.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.experimented_platform.push(obj);
      }
      */
  }

  
    findIndexToUpdate(obj) 
    { 
        return obj.value === this;
    }

   blockchain_exp(expForm: NgForm) 
   {
      //console.log(expForm.value);
       this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    

        this.authenticationService.resume(this.currentUser._creator,expForm.value)
            .subscribe(
                data => {
                if(data && this.currentUser)
                {
                    this.router.navigate(['/experience']);
                    //window.location.href = '/experience';
                }

                if(data.error )
                {
                    //console.log(data.error);
                }
               
                },
                error => {
                  //this.log = 'Something getting wrong';
                   
                });
   }

   oncommerciallyOptions(obj)
   {
    
   let updateItem = this.commercially_worked.find(this.findIndexToUpdate, obj.value);
      let index = this.commercially_worked.indexOf(updateItem);
      if(index > -1)
      {
        this.commercially_worked.splice(index, 1);
          let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'platform_name',  obj.value);
       ////console.log(updateItem);
      let index2 = this.commercial_expYear.indexOf(updateItem2);

      if(index2 > -1)
      {
          
        this.commercial_expYear.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.commercially_worked.push(obj);
      }
    //console.log(this.commercial_expYear);
      
   }

   onPlatformOptions(obj)
   {
    
   let updateItem = this.platforms_designed.find(this.findIndexToUpdate, obj.value);
      let index = this.platforms_designed.indexOf(updateItem);
      if(index > -1)
      {
        this.platforms_designed.splice(index, 1);
          let updateItem2 = this.findObjectByKey(this.platforms, 'platform_name', obj.value);
       ////console.log(updateItem);
      let index2 = this.platforms.indexOf(updateItem2);

      if(index2 > -1)
      {
          
        this.platforms.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.platforms_designed.push(obj);
      }

      
   }

   onExpYearOptions(e , value)
   {
      
       /*this.value=value;
      this.referringData = { experimented_platform:this.value, exp_year: e.target.value}; 
      this.expYear.push(this.referringData);*/ 
     
       this.selectedValue = e.target.value;
       //console.log(value);
       this.langValue = value;
       //console.log(this.expYear);
         let updateItem = this.findObjectByKey(this.expYear, 'experimented_platform', value);
       ////console.log(updateItem);
      let index = this.expYear.indexOf(updateItem);

      if(index > -1)
      {
          
        this.expYear.splice(index, 1);
        this.value=value;
        this.referringData = { experimented_platform:this.value, exp_year: e.target.value}; 
      this.expYear.push(this.referringData);
        //console.log(this.expYear); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
       this.referringData = { experimented_platform :this.value, exp_year: e.target.value}; 
      this.expYear.push(this.referringData);
        //console.log(this.expYear); 
        
      }
       
   }

   selectedValue;langValue;
   onComExpYearOptions(e, value)
   {
      
      /*this.value=value;
     this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData); */
     this.selectedValue = e.target.value;
       this.langValue = value;
        let updateItem = this.findObjectByKey(this.commercial_expYear, 'platform_name', value);
       ////console.log(updateItem);
      let index = this.commercial_expYear.indexOf(updateItem);

      if(index > -1)
      {
          
        this.commercial_expYear.splice(index, 1);
        this.value=value;
        this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData);
        ////console.log(this.LangexpYear); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
       this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData);
        ////console.log(this.LangexpYear); 
        
      }
       
   }
  

   onPlatformYearOptions(e, value)
   {
      this.selectedValue = e.target.value;
       this.langValue = value;
      /*this.value=value;
      this.platformreferringData = { platform_name:this.value, exp_year: e.target.value}; 
      this.platforms.push(this.platformreferringData); 
      //console.log(this.platforms);*/
       
         let updateItem = this.findObjectByKey(this.platforms, 'platform_name', value);
       ////console.log(updateItem);
      let index = this.platforms.indexOf(updateItem);

      if(index > -1)
      {
          
        this.platforms.splice(index, 1);
        this.value=value;
        this.platformreferringData = { platform_name:this.value, exp_year: e.target.value}; 
      this.platforms.push(this.platformreferringData);  
        //console.log(this.platforms); 
        
      }
      else
      {   
      ////console.log("not exists");
        this.value=value;
        this.platformreferringData = { platform_name:this.value, exp_year: e.target.value}; 
      this.platforms.push(this.platformreferringData); 
        //console.log(this.platforms); 
        
      }
      
   }

   /*onPlatformOptions(e)
   {
      if(e.target.checked)
    {
        this.platform.push(e.target.value);
    }

    else
    {
      let updateItem = this.platform.find(this.findIndexToUpdate, e.target.value.maintenancetype);
      let index = this.platform.indexOf(updateItem);
      this.platform.splice(index, 1);
    }
    ////console.log(this.platform);
   }*/

   findObjectByKey(array, key, value) 
    {
      // //console.log(array.length);
        for (var i = 0; i < array.length; i++) 
        {
        // //console.log(array[i][key]);
            if (array[i][key] === value) 
            {
                // //console.log( array[i]);
                return array[i];
            }
       
          }
        return null;
    }
  
}
