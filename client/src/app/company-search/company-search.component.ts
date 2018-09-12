import { Component, OnInit,ViewChild ,ElementRef,AfterViewInit } from '@angular/core';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit,AfterViewInit {
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
//@ViewChild('chosenuser') public blockchainData : Array<Select2OptionData>;
     first_name;last_name;company_name;company_website;company_phone;company_country;
  company_city;company_postcode;company_description;company_founded;company_funded;no_of_employees;
    imgPath;

    display_name;
    interview_location = '';
    interview_time = '';
    select_value='';selecteddd='';
    disabled;
    

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

   ngAfterViewInit(): void 
     {
       
       }
  ngOnInit() 
  {
	  setInterval(() => {
		  this.job_offer_log = '';
	  }, 5000);
      this.length='';
      this.log='';
      this.selectedObj=-1;
      this.countryChange=-1;   
      this.currencyChange= -1;
      this.availabilityChange=-1;
      this.info = [];
      this.msg='';
      this.credentials.currency = -1;
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
      placeholder: 'Position',
      allowClear :true
    }
      
      this.options2 = {
      multiple: true,
      placeholder: 'Blockchain experience',
      allowClear :true
    } 
    
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log(this.currentUser);
     
      if(!this.currentUser)
      {
          this.router.navigate(['/login']);
      }
      else if(this.currentUser && this.currentUser.type == 'company')
      {

          this.authenticationService.getCurrentCompany(this.currentUser._id)
            .subscribe(

                data => 
                {
                    //console.log(data.terms);
                  if(data.terms == false)
                  {
                      this.router.navigate(['/company_wizard']);
                  }
                    
                  else if(!data.company_founded && !data.no_of_employees && !data.company_funded && !data.company_description )
                  {
                      this.router.navigate(['/about_comp']);
                  }
                  else
                  {
                        this.is_approved = data._creator.is_approved;      
                        this.display_name = data.company_name;

                        //console.log(this.is_approved);
                        if(this.is_approved === 0 )
                        {
                            this.disabled = true;
                            this.msg = "You can access this page when your account has been approved by an admin."; 
                            this.log='';  
                        }
                        else if(data._creator.disable_account == true)
                        {
                            this.disabled = true;
                            this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile"; 
                            this.log=''; 

                        }
                        else 
                        {
                            this.disabled = false;
                            this.first_name=data.first_name;
                            this.last_name=data.last_name;
                            this.company_name=data.company_name;
                            this.job_title=data.job_title;
                            this.company_website=data.company_website;
                            this.company_phone =data.company_phone;
                            this.company_country =data.company_country;
                            this.company_city=data.company_city;
                            this.company_postcode=data.company_postcode;
                            this.company_description=data.company_description;
                            this.company_founded =data.company_founded;
                            this.company_funded=data.company_funded;
                            this.no_of_employees=data.no_of_employees;
                            if(data.company_logo != null )
                            {                        
                                ////console.log(data[0].image);                     
                                this.imgPath =  data.company_logo;
                                //console.log(this.imgPath);
                            }
                   
                            this.getVerrifiedCandidate();          
                        }
                        
                      

                  
                  }
                  
                },
                error => 
                {
                    if(error.message == 500)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('googleUser');
                        localStorage.removeItem('close_notify');
                        localStorage.removeItem('linkedinUser');
                        localStorage.removeItem('admin_log');
                        window.location.href = '/login';
                    }
                    
                    if(error.message == 403)
                    {
                        this.router.navigate(['/not_found']);                        
                    }
                  
                });
           
            
      }
      else
      {
           this.router.navigate(['/not_found']);
      }
  }

  rolesItems;

  positionchanged(data) 
  {
      //console.log( data);
      if(this.select_value  !== data.value)
      {
        this.select_value = data.value;             
        this.searchdata('roles' , this.select_value); 
        }  
       
  }

  blockchainItems;
  blockchainchanged(data)
  {
    //console.log("blockchain"); 
      if(this.selecteddd  !== data.value)
      {
        this.selecteddd = data.value; 
       this.searchdata('blockchain' , this.selecteddd);
      }
  
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
    
    selectedObj;countryChange;positionChange;availabilityChange;blockchainChange;salary;currencyChange;
    search_result=[];information;
    not_found;
    salarysearchdata(key , value)
    {
        
        if(this.salary)
        {
            if(this.currencyChange !== -1)
            {
                this.searchdata(key , value);
            }
            
        }
            
         
    }
    searchdata(key , value)
    {   
    
        this.not_found='';
        this.length =0; 
        this.cand_data=[];
       this.log='';
        this.response='';

        if(!this.searchWord && !this.select_value && !this.selecteddd  && !this.salary  && this.selectedObj === -1 &&  this.countryChange === -1 
        &&  this.currencyChange === -1 &&  this.availabilityChange === -1 )
        {             
           
             this.getVerrifiedCandidate();
        }
        
       
        else
        { 
       
          this.authenticationService.filterSearch(this.searchWord ,this.selectedObj , this.countryChange , this.select_value ,this.selecteddd, this.availabilityChange, this.salary , this.currencyChange )
            .subscribe(
                data => 
                {
                    
                   
                    
                    if(data.error)
                    {
                       
                        this.length='';
                        this.log = data.error;
                        this.cand_data=[];
                        this.page='';
                         this.response = "data";
                    }
                    else
                    {
                        this.length=0;
                        this.cand_data=[];
                        this.log='';
                        this.information = this. filter_array(data);
                        this.lengthmsgg='not initial';
                        for(let res of this.information)
                        {
                            
                            if(res['ids'].length<=0)
                            {
                              this.not_found= "Not Found Any Data";
                            }
                            else
                            {
                            for(let ids of res['ids'])
                            {
                                 this.authenticationService.get_user_messages(ids,this.currentUser._creator)
                                .subscribe(
                                 data => {

                                    if(data['datas'][1]){
                                        if(data['datas'][1].is_company_reply==1)
                                        {
                                            //console.log('accept')
                                            //console.log("iffffffffffff");
                                            this.authenticationService.candidate_detail(ids, data['datas'][1].is_company_reply  )
                                            .subscribe(
                                            dataa => 
                                            {
                                                if(dataa)
                                                {
                                                    dataa.company_reply =data['datas'][1].is_company_reply;                                                        
                                                    this.cand_data.push(dataa);
                                                    //console.log(this.cand_data);
                                                }
                                            },
                                            error => 
                                            {
                                                if(error.message == 500)
                                                {
                                                     localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                                     localStorage.removeItem('currentUser');
                                                     localStorage.removeItem('googleUser');
                                                     localStorage.removeItem('close_notify');
                                                     localStorage.removeItem('linkedinUser');
                                                     localStorage.removeItem('admin_log');
                                                     window.location.href = '/login';
                                                 }
                    
                                                  if(error.message == 403)
                                                  {
                                                       this.router.navigate(['/not_found']);                        
                                                   }
                  
                                               });
                                            }
                                           
                                        //console.log(this.company_reply);
                                    }
                                    else
                                    {
                                        //console.log("else");
                                        this.rply =0;
                                        this.authenticationService.candidate_detail(ids,  this.rply )
                                        .subscribe(
                                        result => 
                                        {
                                            if(result)
                                            {
                                                    result.company_reply =0;
                                                    this.cand_data.push(result);
                                                    this.first_name = result.initials;
                                                    //console.log(this.cand_data);
                                                }
                                         },
                                        error => 
                                        {
                                            if(error.message == 500)
                                            {
                                                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                                                localStorage.removeItem('currentUser');
                                                localStorage.removeItem('googleUser');
                                                localStorage.removeItem('close_notify');
                                                localStorage.removeItem('linkedinUser');
                                                localStorage.removeItem('admin_log');
                                                window.location.href = '/login';
                                            }
                                            if(error.message == 403)
                                            {
                                                this.router.navigate(['/not_found']);                        
                                            }
                  
                                        });
                                    }
                        
                      
                                },
                                error => {
                                    //console.log('error');
                                    //console.log(error);
                                    //this.log = error;
                                }
                                );
                                           
                              }
                                }

                                this.response = "data";
                        }
                            
                         

                    }
                            
                },
                error => 
                {
                    if(error.message == 500)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('googleUser');
                        localStorage.removeItem('close_notify');
                        localStorage.removeItem('linkedinUser');
                        localStorage.removeItem('admin_log');
                        window.location.href = '/login';
                    }
                    
                    if(error.message == 403)
                    {
                        this.router.navigate(['/not_found']);                        
                    }
                  
                });
            
        }
        
        
    }
    
    actionType;


    reset()
    {

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
        this.searchWord='';
       
        this.getVerrifiedCandidate();
       
    }
    
    company_reply;
    //verify_candidate=[];
    cand_data=[];
    rply;
    lengthmsgg;
    filter_data;
    response;
    getVerrifiedCandidate()
    {     
        this.length=0;
        this.info = [];
        this.cand_data=[];
        this.lengthmsgg='';
        this.response='';
        this.msg='';
		this.authenticationService.getVerrifiedCandidate(this.currentUser._creator)
        .subscribe(
			dataa => {
                
				//console.log(dataa);
				for(let res of dataa)
				{ 
					//console.log("ids");
                    if(res['ids'].length<=0)
                    {
                        this.response = "data";
                        this.not_found = "Not found any data";
                        
                    }
                    else
                    {
					for(let ids of res['ids'])
					{
						this.authenticationService.get_user_messages(ids,this.currentUser._creator)
						.subscribe(
							data => {
								if(data['datas'][0]){
									if(data['datas'][0].is_company_reply==1){
										//console.log('accept')
										//console.log("iffffffffffff");
										//console.log(ids);
										this.authenticationService.candidate_detail(ids, data['datas'][0].is_company_reply  )
										.subscribe(
											dataa =>
											{
												if(dataa)
												{
													//console.log("1");
													dataa.company_reply =data['datas'][0].is_company_reply;                                                        
													this.cand_data.push(dataa);
													//console.log(this.cand_data);
												}
											},
											error =>
											{
												if(error.message == 500)
												{
													localStorage.setItem('jwt_not_found', 'Jwt token not found');
													localStorage.removeItem('currentUser');
													localStorage.removeItem('googleUser');
													localStorage.removeItem('close_notify');
													localStorage.removeItem('linkedinUser');
													localStorage.removeItem('admin_log');
													window.location.href = '/login';
												}
												if(error.message == 403)
												{
													this.router.navigate(['/not_found']);                        
												}
											}
										);
									}
									else
									{
										//console.log("else");
										//console.log(ids);
										this.rply =0;
										this.authenticationService.candidate_detail(ids,  this.rply )
										.subscribe(
											result =>
											{
												if(result)
												{
													//console.log("2");
													result.company_reply =0;
													this.cand_data.push(result);
													this.first_name = result.initials;
													//console.log(this.cand_data);
												}
											},
											error =>
											{
												if(error.message == 500)
												{
													localStorage.setItem('jwt_not_found', 'Jwt token not found');
													localStorage.removeItem('currentUser');
													localStorage.removeItem('googleUser');
													localStorage.removeItem('close_notify');
													localStorage.removeItem('linkedinUser');
													localStorage.removeItem('admin_log');
													window.location.href = '/login';
												}
												if(error.message == 403)
												{
													this.router.navigate(['/not_found']);                        
												}
											}
										);
									}
								}
								else
								{
									//console.log("else");
									//console.log(ids);
									this.rply =0;
									this.authenticationService.candidate_detail(ids,  this.rply )
									.subscribe(
										result => 
										{
											if(result)
											{
												//console.log("2");
												result.company_reply =0;
												this.cand_data.push(result);
												this.first_name = result.initials;
												//console.log(this.cand_data);
											}
										},
										error =>
										{
											if(error.message == 500)
											{
												localStorage.setItem('jwt_not_found', 'Jwt token not found');
												localStorage.removeItem('currentUser');
												localStorage.removeItem('googleUser');
												localStorage.removeItem('close_notify');
												localStorage.removeItem('linkedinUser');
												localStorage.removeItem('admin_log');
												window.location.href = '/login';
											}
											if(error.message == 403)
											{
												this.router.navigate(['/not_found']);                        
											}
										}
									);
								}
							},
							error => {
								//console.log('error');
								//console.log(error);
								//this.log = error;
							}
						);
						this.authenticationService.getCurrentCompany(this.currentUser._creator)
						.subscribe(
							data => {
								this.company_name = data.company_name;
							},
							error => {
								if(error.message == 500 || error.message == 401  )
								{
									localStorage.setItem('jwt_not_found', 'Jwt token not found');
									window.location.href = '/login';
								}
								if(error.message == 403)
								{
									this.router.navigate(['/not_found']);                        
								}
							}
						);
					}
                        
                        }
                    this.response = "data";
				} 
			},
            error => {
				if(error.message == 500)
				{
					localStorage.setItem('jwt_not_found', 'Jwt token not found');
					localStorage.removeItem('currentUser');
					localStorage.removeItem('googleUser');
					localStorage.removeItem('close_notify');
					localStorage.removeItem('linkedinUser');
					localStorage.removeItem('admin_log');
					window.location.href = '/login';
                }
				if(error.message == 403)
				{
					this.router.navigate(['/not_found']);                        
                }
                    
            }
		);
		this.length++;
		if(this.length> 0 )
		{
			this.page =this.length;
			this.log='';
		}else
		{
			this.log= 'Not Found Any Data';                           
        }
		this.length = '';
    }
    informations;
 
    user_id;user_name;
    onSubmit(val) {
        //console.log(val)
        this.user_id =val;
        this.user_name = val;
    }

	date_of_joining;
	msg_tag;
	is_company_reply = 0;
	msg_body;
	job_offer_log;
	description;
    send_job_offer(msgForm : NgForm){
        //console.log("Used ID: " + this.user_id.id);
        //console.log("Name: " + this.user_id.name);
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(this.credentials.job_title && this.credentials.salary && this.credentials.location){
            this.authenticationService.get_job_desc_msgs(this.currentUser._creator,this.user_id.id,'job_offer')
			.subscribe(
				data => {
					//console.log(data['datas']);
					if(data['datas'].length>0){
						this.job_offer_log = 'Message already sent';
					}
					else{
						this.date_of_joining = '10-07-2018';
						this.msg_tag = 'job_offer';
						this.is_company_reply = 0;
						this.msg_body = '';
						this.description = this.credentials.job_desc;
						this.authenticationService.insertMessage(this.currentUser._creator,this.user_id.id,this.display_name,this.user_id.name,this.msg_body,this.description,this.credentials.job_title,this.credentials.salary,this.credentials.currency,this.date_of_joining,this.credentials.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
							.subscribe(
								data => {
									//console.log(data);
									this.job_offer_log = 'Message successfully sent';
									this.credentials.job_title = '';
									this.credentials.salary = '';
									this.credentials.currency = '';
									this.credentials.location = '';
									this.credentials.job_type = '';
									this.credentials.job_desc = '';
								},
								error => {
									//console.log('error');
									//console.log(error);
									//this.log = error;
								}
							);
					}
				},
				error => {
					 if(error.message == 500 || error.message == 401)
                    {
                        localStorage.setItem('jwt_not_found', 'Jwt token not found');
                         localStorage.removeItem('currentUser');
                                        localStorage.removeItem('googleUser');
                                        localStorage.removeItem('close_notify');
                                        localStorage.removeItem('linkedinUser');
                                        localStorage.removeItem('admin_log');
                        window.location.href = '/login';
                    }
                    
                    if(error.message == 403)
                    {
                        this.router.navigate(['/not_found']);                        
                    }
				}
			);
        }
        else{
            this.job_offer_log = 'Please enter all info';
        }
    }


}
