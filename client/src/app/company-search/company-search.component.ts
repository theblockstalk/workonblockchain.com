import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit {
   currentUser: User;
  log;info=[];roleChange;options2;length;page;searchWord;
    credentials: any = {};job_title;
     public rolesData: Array<Select2OptionData>;
    public blockchainData : Array<Select2OptionData>;
  public options: Select2Options;
  public value;
  public current: string;
  msg;
    is_approved;
  constructor(private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }
    
  language_opt=
    [
      {name:'Java', value:'Java', checked:false},{name:'C', value:'C', checked:false},
      {name:'C++', value:'C++', checked:false},{name:'C#', value:'C#', checked:false},
      {name:'Python', value:'Python', checked:false},{name:'Visual Basic .NET', value:'Visual Basic .NET', checked:false},
      {name:'PHP', value:'PHP', checked:false},{name:'JavaScript', value:'JavaScript', checked:false},
      {name:'Delphi/Object Pascal', value:'Delphi/Object Pascal', checked:false},{name:'Swift', value:'Swift', checked:false},
      {name:'Perl', value:'Perl', checked:false},{name:'Ruby', value:'Ruby', checked:false},
      {name:'Assembly language', value:'Assembly language', checked:false},{name:'R', value:'R', checked:false},
      {name:'Visual Basic', value:'Visual Basic', checked:false},{name:'Objective-C', value:'Objective-C', checked:false},
      {name:'Go', value:'Go', checked:false},{name:'MATLAB', value:'MATLAB', checked:false},
      {name:'PL/SQL', value:'PL/SQL', checked:false},{name:'Scratch', value:'Scratch', checked:false},
      {name:'Solidity', value:'Solidity', checked:false},{name:'Serpent', value:'Serpent', checked:false},
      {name:'LLL', value:'LLL', checked:false},{name:'Nodejs', value:'Nodejs', checked:false},
      {name:'Scala', value:'Scala', checked:false},{name:'Rust', value:'Rust', checked:false},
      {name:'Kotlin', value:'Kotlin', checked:false},{name:'Haskell', value:'Haskell', checked:false},

    ]
    
     
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
    
  
  cities = 
  [
    {country_code:'000' , name:'Remote', value:'remote', checked:false},
    {country_code:'001' ,name:'Paris', value:'Paris', checked:false},
    {country_code:'001' ,name:'London', value:'London', checked:false}, 
    {country_code: '001' ,name:'Dublin', value:'Dublin', checked:false},
    {country_code: '001' ,name:'Amsterdam', value:'Amsterdam', checked:false},
    {country_code: '001' ,name:'Berlin', value:'Berlin', checked:false},
    {country_code: '002' ,name:'Munich', value:'Munich', checked:false},
    {country_code: '002' ,name:'San Francisco', value:'San Francisco', checked:false},
    {country_code: '002' ,name:'New York', value:'New York', checked:false},
    {country_code: '002' ,name:'Los Angeles', value:'Los Angeles', checked:false},
    {country_code: '002' ,name:'Boston', value:'Boston', checked:false},
    {country_code: '003' ,name:'Chicago', value:'Chicago', checked:false},
    {country_code: '004' ,name:'Austin', value:'Austin', checked:false},
    {country_code: '004' ,name:'Zug', value:'Zug', checked:false},
    {country_code: '004' ,name:'Zurich', value:'Zurich', checked:false},
    {country_code: '004' ,name:'Edinburgh', value:'Edinburgh', checked:false},
    {country_code: '004' ,name:'Copenhagen', value:'Copenhagen', checked:false},
    {country_code: '004' ,name:'Stockholm', value:'Stockholm', checked:false},
    {country_code: '004' ,name:'Madrid', value:'Madrid', checked:false},
    
  ]

    
  currency=
  [
      "£ GBP" ,"€ EUR" , "$ USD"
  ]
    
  month= 
  [
       "Now","1 month","2 months","3 months","Longer than 3 months"
  ]
  
  job_type = ["Part Time", "Full Time"];


  ngOnInit() 
  {
      this.length='';
      this.log='';
      this.selectedObj=-1;
      this.countryChange=-1;   
      this.currencyChange= -1;
      this.availabilityChange=-1;
      this.info = [];
      this.msg='';
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
      console.log(this.currentUser);
     
      if(!this.currentUser)
      {
          this.router.navigate(['/login']);
      }
      else if(this.currentUser && this.currentUser.type == 'company')
      {
            this.authenticationService.getCurrentCompany(this.currentUser._creator)
            .subscribe(
            data => {
               console.log(data);
                this.is_approved = data[0]._creator.is_approved;
                console.log(this.is_approved);
               if(this.is_approved === 0)
                {
                    this.msg = "You can access this feature when your profile has been approved"; 
                    this.log='';  
                }
                else
                {
                    this.msg='';
          
                }

            });        
           
            this.getVerrifiedCandidate();
      }
      else
      {
           this.router.navigate(['/not_found']);
      }
  }

  rolesItems;
  positionchanged(data) 
  {
      console.log("position");
      this.rolesItems = data.value;    
      this.searchdata('roles' , this.rolesItems);  
  }

  blockchainItems;
  blockchainchanged(data)
  {
    console.log("blockchain"); 
      this.blockchainItems = data.value; 
       this.searchdata('blockchain' , this.blockchainItems);
  
   }
    
    selectedObj;countryChange;positionChange;availabilityChange;blockchainChange;salary;currencyChange;
    search_result=[];
    searchdata(key , value)
    {
        this.length =0; 
        this.info=[];
        if(!this.select_value && !this.selecteddd &&!this.rolesItems && !this.salary && !this.blockchainItems && this.selectedObj === -1 &&  this.countryChange === -1 
        &&  this.currencyChange === -1 &&  this.availabilityChange ===-1 )
        {             
            console.log("iffffffff"); 
             this.getVerrifiedCandidate();
        }
               
        else
        { 

            console.log("else");
            this.authenticationService.filterSearch(this.selectedObj , this.countryChange , this.rolesItems ,this.blockchainItems, this.availabilityChange, this.salary , this.currencyChange )
            .subscribe(
                data => 
                {
                    console.log(data);
                    
                    if(data.error)
                    {
                       // console.log(this.info);
                        this.length='';
                        this.log = data.error;
                        this.info=[];
                        this.page='';
                        

                    }
                    else
                    {
                         //console.log(this.log);
                        
                        //this.info = data; 
                        for(let res of data)
                        {
                          if(res.first_name && res.roles && res.why_work && res.experience_roles && res.availability_day 
                            && res.nationality && res.last_name  && res.contact_number && res.education && res.history &&  res.platforms 
                             && res.commercial_platform && res.interest_area  && res.country )
                            {
                                //this.search_result.push(res);
                                  this.length++;
                                this.info.push(res);
                            }
                            
                            //console.log(this.search_result.length);
                        }
                        //this.length = data.length;
                        if(this.length> 0 )
                        {
                            //this.length = this.search_result.length;
                             this.log='';
                        }
                        else
                        {
                            this.log= 'Not Found Any Data';
                        }
                       // this.page = data.length; 
                        this.page =this.length;   
                        console.log(this.length);                   
                    }
                            
                },
                error => 
                {
                  
                });
            
        }
        
        
    }
    select_value;selecteddd;
    reset()
    {
        console.log("reset");
        this.selectedObj=-1;
        this.countryChange=-1;
        this.rolesItems='';
        this.salary='';
        this.currencyChange= -1;
        this.availabilityChange=-1;
        this.blockchainItems='';
        this.select_value ='';
        this.selecteddd = '';
        this.info = [];
        //this.positionchanged(this.select_value);
        this.getVerrifiedCandidate();
       
    }
    
    //verify_candidate=[];
    getVerrifiedCandidate()
    {     
        this.length=0;
        this.info = [];
          this.authenticationService.getVerrifiedCandidate()
            .subscribe(
                data => 
                {
                    console.log(data);
                  //console.log(data);
                   
                    if(data.error)
                    {
                        
                        this.log = data.error;
                        this.page='';
                        this.info=[];
                        
                    }   
                    else
                    {
                        this.info=[];
                        //this.info = data;
                        //console.log(this.info);
                        for(let res of data)
                        {
                            if(res.first_name && res.roles && res.why_work && res.experience_roles && res.availability_day 
                            && res.nationality && res.last_name  && res.contact_number && res.education && res.history &&  res.platforms 
                             && res.commercial_platform && res.interest_area  && res.country )
                            {
                                this.length++;
                                this.info.push(res);
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
                        

                       
                    }
                 
                },
                error => 
                {
                  
                });
    }
    
    onSearchWord(f: NgForm)
    {
        //console.log(f.value.word);
        this.length=0;
        this.info=[];
         this.authenticationService.searchByWord(f.value.word)
            .subscribe(
                data => 
                {
                    //console.log(data);
                    
                     if(data.error)
                    {
                      
                        this.length='';
                        this.log = data.error;
                        this.info=[];
                        this.page='';
                    }
                    else
                    {
                        // console.log(this.log);
                         for(let res of data)
                        {
                          if(res.first_name && res.roles && res.why_work && res.experience_roles && res.availability_day 
                            && res.nationality && res.last_name  && res.contact_number && res.education && res.history &&  res.platforms 
                             && res.commercial_platform && res.interest_area  && res.country )
                            {
                                //this.search_result.push(res);
                                  this.length++;
                                this.info.push(res);
                            }
                            
                            //console.log(this.search_result.length);
                        }
                        //this.length = data.length;
                        if(this.length> 0 )
                        {
                            //this.length = this.search_result.length;
                             this.log='';
                        }
                        else
                        {
                            this.log= 'Not Found Any Data';
                        }
                       // this.page = data.length; 
                        this.page =this.length;   
                        console.log(this.length);                   
                    }
                            
                },
                error => 
                {
                  
                });
    }
	user_id;user_name;
	onSubmit(val) {
		console.log(val)
		this.user_id =val;
		this.user_name = val;
	}

	date_of_joining;
	msg_tag;
	is_company_reply = 0;
	msg_body;
	job_offer_log;
    send_job_offer(msgForm : NgForm){
		console.log("Used ID: " + this.user_id.id);
        console.log("Name: " + this.user_id.name);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
		if(this.credentials.job_title && this.credentials.salary && this.credentials.location){
            this.authenticationService.get_job_desc_msgs(this.currentUser._creator,this.user_id.id,'job_offer')
			.subscribe(
				data => {
					console.log(data['datas']);
					if(data['datas'].length>0){
						this.job_offer_log = 'Message already sent';
					}
					else{
						this.date_of_joining = '10-07-2018';
						this.msg_tag = 'job_offer';
						this.is_company_reply = 0;
						this.msg_body = this.credentials.job_desc;
						this.authenticationService.insertMessage(this.currentUser._creator,this.user_id.id,this.currentUser.email,this.user_id.name,this.msg_body,this.credentials.job_title,this.credentials.salary,this.date_of_joining,this.credentials.job_type,this.msg_tag,this.is_company_reply)
							.subscribe(
								data => {
									console.log(data);
									this.job_offer_log = 'Message successfully sent';
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
            this.job_offer_log = 'Please enter all info';
        }
    }


}
