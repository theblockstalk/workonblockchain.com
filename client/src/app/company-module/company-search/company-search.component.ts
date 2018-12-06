import { Component, OnInit,ViewChild ,ElementRef,AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit,AfterViewInit {
  currentUser: User;
  log;
  info=[];
  length;
  page;
  searchWord;
  credentials: any = {};
  job_title;
  public value;
  public current: string;
  msg;
  is_approved;
  first_name;
  last_name;
  company_name;
  company_website;
  company_phone;
  company_country;
  company_city;
  company_postcode;
  company_description;
  company_founded;
  company_funded;
  no_of_employees;
  imgPath;
  display_name;
  interview_location = '';
  interview_time = '';
  select_value='';
  selecteddd='';
  disabled;
  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;
  job_offer_log;
  saved_searches;
  location_value = '';
  skill_value= '';
  location;
  role_value;
  blockchain_value;
  constructor(private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }


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
      {name:'Steemit', value:'Steemit', checked:false},
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

  currency=
    [
      "£ GBP" ,"€ EUR" , "$ USD"
    ]

  month=
    [
      "Now","1 month","2 months","3 months","Longer than 3 months"
    ]

  job_type = ["Part Time", "Full Time"];

  skillsData=
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

  locationsData = [
    {country_code:'000' , name:'Remote', value:'remote', checked:false},
    {country_code:'001' ,name:'Paris', value:'Paris', checked:false},
    {country_code:'001' ,name:'London', value:'London', checked:false},
    {country_code: '001' ,name:'Dublin', value:'Dublin', checked:false},
    {country_code: '001' ,name:'Amsterdam', value:'Amsterdam', checked:false},
    {country_code: '001' ,name:'Berlin', value:'Berlin', checked:false},
    {country_code: '001' ,name:'Barcelona', value:'Barcelona', checked:false},
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
    {country_code: '004' ,name:'Toronto', value:'Toronto', checked:false},
    {country_code: '004' ,name:'Sydney', value:'Sydney', checked:false},

  ]

  rolesData =
    [
      {name:'Backend Developer', value:'Backend Developer', checked:false},
      {name:'Frontend Developer', value:'Frontend Developer', checked:false},
      {name:'UI Developer', value:'UI Developer', checked:false},
      {name:'UX Designer', value:'UX Designer', checked:false},
      {name:'Fullstack Developer', value:'Fullstack Developer', checked:false},
      {name:'Blockchain Developer', value:'Blockchain Developer', checked:false},
      {name:'Smart Contract Developer', value:'Smart Contract Developer', checked:false},
      {name:'Architect', value:'Architect', checked:false},
      {name:'DevOps', value:'DevOps', checked:false},
      {name:'Software Tester', value:'Software Tester', checked:false},
      {name:'CTO', value:'CTO', checked:false},
      {name:'Technical Lead', value:'Technical Lead', checked:false},
      {name:'Product Manager', value:'Product Manager', checked:false},
      {name:'Intern Developer', value:'Intern Developer', checked:false},
      {name:'Researcher ', value:'Researcher', checked:false},
      {name:'Mobile app developer', value:'Mobile app developer', checked:false},
      {name:'Data scientist', value:'Data scientist', checked:false},
      {name:'Security specialist ', value:'Security specialist', checked:false},
    ];

  blockchainData =
    [
      {value:'Bitcoin', name:'Bitcoin', checked:false},
      {value:'Ethereum', name:'Ethereum', checked:false},
      {value:'Ripple', name:'Ripple', checked:false},
      {value:'Stellar', name:'Stellar', checked:false},
      {value:'Hyperledger Fabric', name:'Hyperledger Fabric', checked:false},
      {value:'Hyperledger Sawtooth', name:'Hyperledger Sawtooth', checked:false},
      {value:'Quorum', name:'Quorum', checked:false},
      {value:'Corda', name:'Corda', checked:false},
      {value:'EOS', name:'EOS', checked:false},
      {value:'NEO', name:'NEO', checked:false},
      {value:'Waves', name:'Waves', checked:false},
      {value:'Steemit', name:'Steemit', checked:false},
      {value:'Lisk', name:'Lisk', checked:false},
      {value:'Quantum', name:'Quantum', checked:false},
      {value:'Tezos', name:'Tezos', checked:false},
      {value:'Cardano', name:'Cardano', checked:false},
      {value:'Litecoin', name:'Litecoin', checked:false},
      {value:'Monero', name:'Monero', checked:false},
      {value:'ZCash', name:'ZCash', checked:false},
      {value:'IOTA', name:'IOTA', checked:false},
      {value:'NEM', name:'NEM', checked:false},
      {value:'NXT', name:'NXT', checked:false},
      {value:'Dash', name:'Dash', checked:false},
      {value:'Doge', name:'Doge', checked:false},
    ]

  ngAfterViewInit() {
    window.scrollTo(0, 0)
    $('.selectpicker').selectpicker();
  }

  ngAfterViewChecked() {
    $('.selectpicker').selectpicker('refresh');
    $('select').addClass('selectwidthauto');
  }
  skill;
  ngOnInit()
  {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '10rem',
      width: '56rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };
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

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.currentUser.type == 'company')
    {
      this.skillsData.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.locationsData.sort(function(a, b){
        if(b.name === 'Remote' || a.name === 'Remote') {
        }
        else {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        }
      })

      this.rolesData.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.blockchainData.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })



      this.authenticationService.getCurrentCompany(this.currentUser._id)
        .subscribe(

          data =>
          {

            if(data.terms === false)
            {
              this.router.navigate(['/company_wizard']);
            }

            else if(!data.company_founded && !data.no_of_employees && !data.company_funded && !data.company_description )
            {
              this.router.navigate(['/about_comp']);
            }
            else if(!data.saved_searches  || ((new Date(data._creator.created_date) > new Date('2018/11/27')) && data.saved_searches.length === 0)) {
              this.router.navigate(['/preferences']);

            }
            else
            {
              this.is_approved = data._creator.is_approved;
              this.display_name = data.company_name;

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
                  this.imgPath =  data.company_logo;
                }
                if(data.saved_searches && data.saved_searches.length > 0) {
                  this.saved_searches = data.saved_searches;
                  this.location_value = data.saved_searches[0].location;
                  this.skill_value = data.saved_searches[0].skills;

                  if(data.saved_searches[0].blockchain && data.saved_searches[0].blockchain.length > 0) {
                    this.blockchain_value = data.saved_searches[0].blockchain;
                  }

                  if(data.saved_searches[0].position && data.saved_searches[0].position.length > 0) {
                    this.role_value = data.saved_searches[0].position;
                  }
                  this.salary = data.saved_searches[0].current_salary;
                  this.currencyChange = data.saved_searches[0].current_currency;
                  this.availabilityChange = data.saved_searches[0].availability_day;
                  this.searchdata('filter' , data.saved_searches[0] );
                }
                else {
                  this.getVerrifiedCandidate();

                }

              }
            }

          },
          error =>
          {
            if(error.message === 500)
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


    }
    else
    {
      this.router.navigate(['/not_found']);
    }
  }

  rolesItems;

  positionchanged(data)
  {
    this.not_found = '';
    if(this.select_value  !== data.value)
    {
      this.select_value = data.value;
      this.searchdata('roles' , this.select_value);
    }

  }

  locationChanged(data)
  {
    this.not_found = '';
    if(this.location_value  !== data.value)
    {
      this.location_value = data.value;
      this.searchdata('location' , this.location_value);
    }

  }

  skillChanged(data)
  {
    this.not_found = '';
    if(this.skill_value  !== data.value)
    {
      this.skill_value = data.value;
      this.searchdata('skill' , this.skill_value);
    }

  }

  blockchainItems;
  blockchainchanged(data)
  {
    this.not_found = '';
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

  selectedObj;countryChange;availabilityChange;salary;currencyChange;
  information;
  not_found;
  salarysearchdata(key , value) {
    console.log(key);
    console.log(value);

    this.not_found = '';

    if (this.salary) {
      if (this.currencyChange !== -1) {
        this.searchdata(key, value);
      }
      else {
        let queryBody : any = {};
        if(this.searchWord) queryBody.word = this.searchWord;
        if(this.skill_value && this.skill_value.length > 0) queryBody.skills = this.skill_value;
        if(this.location_value && this.location_value.length > 0) queryBody.locations = this.location_value;
        if(this.select_value && this.select_value.length > 0 ) queryBody.positions = this.select_value;
        if(this.selecteddd && this.selecteddd.length > 0) queryBody.blockchains = this.selecteddd;
        if(this.availabilityChange !== -1) queryBody.availability_day = this.availabilityChange;
        if(this.salary && this.currencyChange !== -1) {
          queryBody.current_salary  = this.salary;
          queryBody.current_currency = this.currencyChange;
        }
        this.authenticationService.filterSearch(queryBody)
        .subscribe(
          data => {
            this.candidate_data = data;
            this.responseMsg = "response";
            if (this.candidate_data.length <= 0) {
              this.not_found = 'No candidates matched this search criteria';
            }
            if(this.candidate_data.length > 0) {
              this.not_found='';
            }
          },
          error =>
          {
            if(error.message === 500)
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

          }
        );
      }
    }
  }

  searchdata(key , value)
  {
    this.log='';
    this.candidate_data='';
    this.verify_msg = "";
    this.responseMsg = "";
    this.not_found='';
    if(!this.searchWord && !this.role_value && !this.blockchain_value  && !this.salary  && !this.skill_value &&  !this.location_value &&  this.currencyChange === -1 &&  this.availabilityChange === -1 )
    {
      this.getVerrifiedCandidate();
    }

    else {
      this.not_found = '';
      let queryBody : any = {};
      if(this.searchWord) queryBody.word = this.searchWord;
      if(this.skill_value && this.skill_value.length > 0) queryBody.skills = this.skill_value;
      if(this.location_value && this.location_value.length > 0) queryBody.locations = this.location_value;
      if(this.role_value && this.role_value.length > 0 ) queryBody.positions = this.role_value;
      if(this.blockchain_value && this.blockchain_value.length > 0) queryBody.blockchains = this.blockchain_value;
      if(this.availabilityChange !== -1) queryBody.availability_day = this.availabilityChange;
      if(this.salary && this.currencyChange !== -1) {
        queryBody.current_salary  = this.salary;
        queryBody.current_currency = this.currencyChange;
      }
      this.authenticationService.filterSearch(queryBody )
        .subscribe(
          data =>
          {
            console.log(data);
            this.candidate_data = data;
            if(this.candidate_data.length > 0) {
              this.not_found='';
            }
            this.responseMsg = "response";
          },
          error =>
          {
            this.not_found='';
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.responseMsg = "error";
              this.not_found = error['error']['message'];
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.responseMsg = "error";
              this.not_found = error['error']['message'];
            }
            else {
              this.log = 'Something getting wrong';
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
    this.blockchain_value ='';
    this.location_value = '';
    this.skill_value = '';
    this.role_value = '';
    this.info = [];
    this.searchWord='';

    this.getVerrifiedCandidate();

  }

  cand_data=[];
  response;
  count;
  candidate_data;
  verify_msg;
  responseMsg;
  programming_languages;
  getVerrifiedCandidate()
  {
    this.log='';
    this.candidate_data='';
    this.verify_msg = "verified candidate";
    this.responseMsg='';
    this.not_found='';

    this.authenticationService.getVerrifiedCandidate(this.currentUser._creator)
      .subscribe(
        dataa => {
          this.candidate_data = dataa;
          if(this.candidate_data.length > 0) {
            this.not_found='';
          }
          this.responseMsg = "response";
        },

        error => {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.responseMsg = "error";
            this.not_found = error['error']['message'];
          }
          else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.responseMsg = "error";
            this.not_found = error['error']['message'];
          }
          else {
            this.log = 'Something getting wrong';
          }

        });


    this.authenticationService.getCurrentCompany(this.currentUser._creator)
      .subscribe(
        data => {
          this.company_name = data.company_name;
        },
        error => {
          if(error.message === 500 || error.message === 401  )
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if(error.message === 403)
          {
            this.router.navigate(['/not_found']);
          }
        }
      );



  }

  user_id;user_name;
  onSubmit(val) {
    this.user_id = val;
    this.user_name = val;
    this.job_offer_log = '';
    this.credentials.job_title = '';
    this.credentials.salary = '';
    this.credentials.currency = '';
    this.credentials.location = '';
    this.credentials.job_type = '';
    this.credentials.job_desc = '';
    this.authenticationService.getLastJobDesc()
    .subscribe(
      data => {
        let prev_job_desc = data;
        this.credentials.job_title = prev_job_desc.job_title;
        this.credentials.salary = prev_job_desc.salary;
        this.credentials.currency = prev_job_desc.salary_currency;
        this.credentials.location = prev_job_desc.interview_location;
        this.credentials.job_type = prev_job_desc.job_type;
        this.credentials.job_desc = prev_job_desc.description;
      },
      error => {
        if (error.message === 500 || error.message === 401) {
          localStorage.setItem('jwt_not_found', 'Jwt token not found');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('googleUser');
          localStorage.removeItem('close_notify');
          localStorage.removeItem('linkedinUser');
          localStorage.removeItem('admin_log');
          window.location.href = '/login';
        }

        if (error.message === 403) {
          this.router.navigate(['/not_found']);
        }
      }
    );
  }
    date_of_joining;
    msg_tag;
    is_company_reply = 0;
    msg_body;
    description;
    send_job_offer(msgForm : NgForm){

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(this.credentials.job_title && this.credentials.location && this.credentials.currency && this.credentials.job_type && this.credentials.job_desc){
            if(this.credentials.salary && Number(this.credentials.salary) && (Number(this.credentials.salary))>0 && this.credentials.salary % 1 === 0){
				this.authenticationService.get_job_desc_msgs(this.user_id.id,'job_offer')
				.subscribe(
					data => {
            this.job_offer_log = 'You have already sent a job description to this candidate';
					},
					error => {
            if(error.status === 500 || error.status === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error.status === 404)
            {
              this.date_of_joining = '10-07-2018';
              this.msg_tag = 'job_offer';
              this.is_company_reply = 0;
              this.msg_body = '';
              this.description = this.credentials.job_desc;
              this.interview_location = this.credentials.location;
              this.authenticationService.insertMessage(this.user_id.id,this.display_name,this.user_id.name,this.msg_body,this.description,this.credentials.job_title,this.credentials.salary,this.credentials.currency,this.date_of_joining,this.credentials.job_type,this.msg_tag,this.is_company_reply,this.interview_location,this.interview_time)
                .subscribe(
                  data => {
                    this.job_offer_log = 'Message successfully sent';
                    this.credentials.job_title = '';
                    this.credentials.salary = '';
                    this.credentials.currency = '';
                    this.credentials.location = '';
                    this.credentials.job_type = '';
                    this.credentials.job_desc = '';
                    $("#myModal").modal("hide");
                    this.router.navigate(['/chat']);
                  },
                  error => {

                  }
                );
            }
					}
				);
			}
			else{
				this.job_offer_log = 'Salary should be a number';
			}
        }
        else{
            this.job_offer_log = 'Please enter all info';
        }
    }

  reset_msgs(){
    this.job_offer_log = '';
    this.credentials.job_title = '';
    this.credentials.salary = '';
    this.credentials.currency = '';
    this.credentials.location = '';
    this.credentials.job_type = '';
    this.credentials.job_desc = '';
  }

  sorting(languages){

    return languages.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    })
  }

}
