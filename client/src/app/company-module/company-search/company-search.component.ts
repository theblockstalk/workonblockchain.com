import { Component, OnInit,ViewChild ,ElementRef,AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;
import {PagerService} from '../../pager.service';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit,AfterViewInit {
  currentUser: User;
  preferncesForm : FormGroup;
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
  skill_value= '';
  location;
  role_value;
  blockchain_value;
  pager: any = {};
  pagedItems: any[];
  countries;
  selectedValueArray=[];
  countriesModel;
  error;
  cities;
  emptyInput;
  errorMsg;
  query_val : any = {};
  query_value : any = {};
  no_value = false;

  constructor(private _fb: FormBuilder , private pagerService: PagerService, private authenticationService: UserService,private route: ActivatedRoute,private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.query_value = JSON.parse(params.queryBody);
      if(this.query_value) {
        this.no_value = true;
        this.query_val = this.query_value;
      }
    });
    if(this.query_val) {
      if(this.query_val.searchName){
        this.name = this.query_val.searchName;
      }
      if(this.query_val.skills){
        this.skill_value = this.query_val.skills;
        this.searchdata('skill' , this.query_val.skills);
      }
      if(this.query_val.locations){
        this.selectedValueArray = this.query_val.locations;
        this.searchdata('locations' , this.query_val.locations);
      }
      if(this.query_val.visa_needed){
        this.visa_check = this.query_val.visa_needed;
        this.searchdata('visa' , this.query_val.visa_needed);
      }
      if(this.query_val.positions){
        this.role_value = this.query_val.positions;
        this.searchdata('role' , this.query_val.positions);
      }
      if(this.query_val.blockchains){
        this.blockchain_value = this.query_val.blockchains;
        this.searchdata('blockchain' , this.query_val.blockchains);
      }
      if(this.query_val.residence_country){
        this.residence_country = this.query_val.residence_country;
        this.searchdata('residence' , this.query_val.residence_country);
      }
      if(this.query_val.current_salary && this.query_val.current_currency){
        this.salary = this.query_val.current_salary;
        this.currencyChange = this.query_val.current_currency;
        this.searchdata('salary' , this.query_val.current_salary);
        this.searchdata('currency' , this.query_val.current_currency);
      }
      if(this.query_val.blockchainOrder){
        this.blockchain_order = this.query_val.blockchainOrder;
        this.searchdata('order_preferences' , this.query_val.blockchainOrder);
      }
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
      "Currency", "£ GBP" ,"€ EUR" , "$ USD"
    ]

  month=
    [
      "Now","1 month","2 months","3 months","Longer than 3 months"
    ]

  job_type = ["Part time", "Full time"];

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
  residenceCountries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
  job_types = ['Full time' , 'Part time' , 'Freelance' ];

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
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);

  }

  ngAfterViewChecked() {

  }
  skill;
  searchName=[];
  savedSearches;
  ngOnInit()
  {
    this.preferncesForm = new FormGroup({
      name: new FormControl(),
      location: new FormControl(),
      visa_needed: new FormControl(),
      job_type: new FormControl(),
      position: new FormControl(),
      current_currency: new FormControl(),
      current_salary: new FormControl(),
      blockchain: new FormControl(),
      skills: new FormControl(),
      other_technologies: new FormControl(),
      order_preferences: new FormControl(),
      residence_country: new FormControl(),
    });

    this.success_msg = '';
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '10rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };
    setInterval(() => {
      this.job_offer_log = '';
    }, 5000);
    this.length='';
    this.log='';
    this.info = [];
    this.msg='';

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



      this.authenticationService.getCurrentCompany(this.currentUser._creator)
        .subscribe(

          data =>
          {

            if(data['terms'] === false)
            {
              this.router.navigate(['/company_wizard']);
            }

            else if(!data['company_founded'] && !data['no_of_employees'] && !data['company_funded'] && !data['company_description'] )
            {
              this.router.navigate(['/about_comp']);
            }
            else if(!data['saved_searches']  || ((new Date(data['_creator'].created_date) > new Date('2018/11/27')) && data['saved_searches'].length === 0)) {
              this.router.navigate(['/preferences']);

            }
            else if (new Date(data['_creator']['created_date']) < new Date('2018/11/28') && !data['saved_searches']) {
              this.router.navigate(['/company_profile']);
            }
            else
            {
              this.is_approved = data['_creator'].is_approved;
              this.display_name = data['company_name'];

              if(this.is_approved === 0 )
              {
                this.disabled = true;
                this.msg = "You can access this page when your account has been approved by an admin.";
                this.log='';
              }
              else if(data['_creator'].disable_account == true)
              {
                this.disabled = true;
                this.msg = "You can access this feature when your profile has been enabled. Go to setting and enable your profile";
                this.log='';

              }
              else
              {
                this.disabled = false;
                if(data['saved_searches'] && data['saved_searches'].length > 0) {
                  this.savedSearches = data['saved_searches'];
                  for(let i=0; i < data['saved_searches'].length; i++) {
                    this.searchName.push(data['saved_searches'][i].name);
                  }
                  setTimeout(() => {
                    $('.selectpicker').selectpicker('refresh');
                  }, 300);

                }
                if(!this.no_value) {
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

  updateCitiesOptions(e) {
  }

  skillChanged(data)
  {
    this.not_found = '';
    this.skill_value = data.value;
    this.searchdata('skill' , this.skill_value);

  }


  blockchainchanged(data)
  {
    this.not_found = '';
    this.searchdata('blockchain' , this.selecteddd);
  }


  salary;currencyChange;
  information;
  not_found;
  visa_check;
  blockchain_order;
  name;

  fillFields(searches, name) {
    this.selectedValueArray = [];
    for(let key of searches) {
      if(key['name'] === name) {
        this.name = name;
        setTimeout(() => {
          $('.selectpicker').selectpicker();
        }, 200);

        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 300);

        if(key['location'])
        {
          for (let country1 of key['location'])
          {
            if (country1['remote'] === true) {
              this.selectedValueArray.push({name: 'Remote' , visa_needed : country1.visa_needed});
            }

            if (country1['city']) {
              let city = country1['city'].city + ", " + country1['city'].country;
              this.selectedValueArray.push({city:country1['city']._id ,name: city , visa_needed : country1.visa_needed});
            }
          }

          this.selectedValueArray.sort();
          if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
            let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
            this.selectedValueArray.splice(0, 0, remoteValue);
            this.selectedValueArray = this.filter_array(this.selectedValueArray);

          }
        }
        if(key['skills']) this.skill_value = key['skills'];
        else this.skill_value = '';

        if(key['visa_needed']) this.visa_check = key['visa_needed'];
        else this.visa_check = false;

        if(key['position']) this.role_value = key['position'];
        else this.role_value = [];

        if(key['blockchain'] && key['blockchain'].length > 0) {
          this.blockchain_value = key['blockchain'];
        }
        else this.blockchain_value = [];

        if(key['current_salary']) this.salary = key['current_salary'];
        else this.salary = '';

        if(key['current_currency']) this.currencyChange = key['current_currency'];
        else this.currencyChange = [];

        if(key['order_preferences']) this.blockchain_order = key['order_preferences'];
        else this.blockchain_order = [];

        if(key['residence_country'] && key['residence_country'].length > 0 ) this.residence_country = key['residence_country'];
        else this.residence_country = '';
      }
    }
  }
  residence_country;
  residence_log;
  searchdata(key , value)
  {
    this.success_msg = '';
    if(key === 'searchName') {
      this.error_msg = '';
      this.fillFields(this.savedSearches, value);
    }
    this.log='';
    this.candidate_data='';
    this.verify_msg = "";
    this.responseMsg = "";
    this.not_found='';
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 500);
    if(this.selectedValueArray && this.selectedValueArray.length > 0) this.newSearchLocation = this.filter_array(this.selectedValueArray);

    this.preferncesForm = this._fb.group({
      name: [],
      location: [],
      visa_needed: [this.visa_check],
      job_type: [],
      position: [this.role_value],
      current_currency: [this.currencyChange],
      current_salary: [this.salary],
      blockchain: [this.blockchain_value],
      skills: [this.skill_value],
      other_technologies: [],
      order_preferences: [this.blockchain_order],
      residence_country: [this.residence_country],
    });


    if(!this.searchWord && !this.residence_country && !this.blockchain_order && !this.role_value && !this.blockchain_value  && !this.salary  && !this.skill_value &&  !this.selectedValueArray &&  !this.currencyChange  )
    {
      this.getVerrifiedCandidate();
    }

    else if (this.residence_country && this.residence_country.length > 50) {
      this.residence_log = "Please select maximum 50 countries";
    }

    else {
      this.not_found = '';
      let queryBody : any = {};
      if(this.searchWord) queryBody.word = this.searchWord;
      if(this.skill_value && this.skill_value.length > 0) queryBody.skills = this.skill_value;
      if(this.selectedValueArray && this.selectedValueArray.length > 0) queryBody.locations = this.filter_array(this.selectedValueArray);
      if(this.role_value && this.role_value.length > 0 ) queryBody.positions = this.role_value;
      if(this.blockchain_value && this.blockchain_value.length > 0) queryBody.blockchains = this.blockchain_value;
      if(this.visa_check) queryBody.visa_needed = this.visa_check;
      if(this.blockchain_order) queryBody.blockchainOrder = this.blockchain_order;
      if(this.residence_country && this.residence_country.length > 0) queryBody.residence_country = this.residence_country;
      if(this.salary && this.currencyChange && this.currencyChange !== 'Currency') {
        queryBody.current_salary  = this.salary;
        queryBody.current_currency = this.currencyChange;
      }
      let newQueryBody : any = {};
      newQueryBody = queryBody;
      if(key === 'searchName') {
        newQueryBody.searchName = value;
      }
      this.router.navigate(['candidate-search'], {
        queryParams: {queryBody: JSON.stringify(newQueryBody)}
      });

      this.authenticationService.filterSearch(queryBody)
        .subscribe(
          data =>
          {
            this.candidate_data = data;
            this.setPage(1);
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

  reset()
  {
    this.salary = '';
    this.info = [];
    this.searchWord = '';
    this.skill_value = '';
    this.selectedValueArray = [];
    this.role_value = '';
    this.blockchain_value = '';
    this.currencyChange = '';
    this.visa_check = false;
    this.residence_country = [];
    this.blockchain_order = [];
    this.name = '';
    $('.selectpicker').val('default');
    $('.selectpicker').selectpicker('refresh');
    this.router.navigate(['candidate-search'], {});
    this.getVerrifiedCandidate();
  }


  success_msg;
  error_msg;
  savedSearch() {
    let queryBody : any = {};
    let index = this.savedSearches.findIndex((obj => obj.name === this.name));
    if(this.name) queryBody.name = this.name;
    if(this.skill_value && this.skill_value.length > 0) queryBody.skills = this.skill_value;
    if(this.selectedValueArray && this.selectedValueArray.length > 0) {
      let validatedLocation =[];
      for(let location of this.selectedValueArray) {
        if(location.name.includes(', ')) {
          validatedLocation.push({city: location.city});
        }
        if(location.name === 'Remote') {
          validatedLocation.push({remote: true });
        }
      }
      queryBody.location = this.filter_array(validatedLocation);
    }
    if(this.role_value && this.role_value.length > 0 ) queryBody.position = this.role_value;
    if(this.blockchain_value && this.blockchain_value.length > 0) queryBody.blockchain = this.blockchain_value;
    if(this.visa_check) queryBody.visa_needed = this.visa_check;
    if(this.blockchain_order) queryBody.order_preferences = this.blockchain_order;
    if(this.residence_country ) queryBody.residence_country = this.residence_country;
    if(this.salary && this.currencyChange) {
      queryBody.current_salary  = this.salary;
      queryBody.current_currency = this.currencyChange;
    }
    this.savedSearches[index] = queryBody;
    if(this.name) {
      this.authenticationService.edit_company_profile({'saved_searches' : this.savedSearches})
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.savedSearches= [];
              this.success_msg = 'Successfully updated';
              if(data['saved_searches'] && data['saved_searches'].length > 0) {
                this.savedSearches = data['saved_searches'];
                this.searchName = [];
                for(let i=0; i < data['saved_searches'].length; i++) {
                  this.searchName.push(data['saved_searches'][i].name);
                }
                setTimeout(() => {
                  $('.selectpicker').selectpicker('refresh');
                }, 300);
              }

              setInterval(() => {
                this.success_msg = "" ;
              }, 5000);
            }

          },
          error => {

          });
    }
    else {
      this.error_msg = 'Please first select saved search';
      setInterval(() => {
        this.error_msg = "" ;
      }, 9000);
    }

  }

  successful_msg;
  new_error_msg;
  residence_country_log;
  savedNewSearch(){
    let queryBody : any = {};
    if(this.preferncesForm.value.name) queryBody.name = this.preferncesForm.value.name;
    if(this.preferncesForm.value.skills && this.preferncesForm.value.skills.length > 0) queryBody.skills = this.preferncesForm.value.skills;
    if(this.newSearchLocation && this.newSearchLocation.length > 0) {
      let validatedLocation =[];
      for(let location of this.newSearchLocation) {
        if(location.name.includes(', ')) {
          validatedLocation.push({city: location.city});
        }
        if(location.name === 'Remote') {
          validatedLocation.push({remote: true });
        }
      }
      queryBody.location = this.filter_array(validatedLocation);
    }
    if(this.preferncesForm.value.position && this.preferncesForm.value.position.length > 0 ) queryBody.position = this.preferncesForm.value.position;
    if(this.preferncesForm.value.job_type && this.preferncesForm.value.job_type.length > 0 ) queryBody.job_type = this.preferncesForm.value.job_type;
    if(this.preferncesForm.value.blockchain && this.preferncesForm.value.blockchain.length > 0) queryBody.blockchain = this.preferncesForm.value.blockchain;
    if(this.preferncesForm.value.visa_needed) queryBody.visa_needed = this.preferncesForm.value.visa_needed;
    if(this.preferncesForm.value.order_preferences) queryBody.order_preferences = this.preferncesForm.value.order_preferences;
    if(this.preferncesForm.value.residence_country) queryBody.residence_country = this.preferncesForm.value.residence_country;
    if(this.preferncesForm.value.current_salary && this.preferncesForm.value.current_currency) {
      queryBody.current_salary  = this.preferncesForm.value.current_salary;
      queryBody.current_currency = this.preferncesForm.value.current_currency;
    }

    let residenceCount = 0;
    if(!this.preferncesForm.value.name) {
      this.new_error_msg = "Please enter saved search name";
      residenceCount = 1;
      setInterval(() => {
        this.new_error_msg = "" ;
      }, 5000);
    }
    if(this.preferncesForm.value.residence_country && this.preferncesForm.value.residence_country.length > 50) {
      this.residence_country_log = "Please select maximum 50 countries";
      residenceCount = 1;
    }

    if(residenceCount === 0) {
      let index = this.savedSearches.findIndex((obj => obj.name === this.preferncesForm.value.name));

      if(index < 0 && this.preferncesForm.value.name) {
        this.savedSearches.push(queryBody);
        this.authenticationService.edit_company_profile({'saved_searches' : this.savedSearches})
          .subscribe(
            data => {
              if(data && this.currentUser)
              {
                this.savedSearches= [];
                this.name = this.preferncesForm.value.name;
                this.searchdata('name' , this.name);
                $('#saveNewSearch').modal('hide');
                this.preferncesForm = this._fb.group({
                  name: [''],
                  location: [],
                  visa_needed: [false],
                  job_type: [],
                  position: [],
                  current_currency: [],
                  current_salary: [''],
                  blockchain: [],
                  skills: [],
                  other_technologies: [''],
                  order_preferences: [],
                  residence_country: [''],
                });
                this.newSearchLocation = [];
                if(data['saved_searches'] && data['saved_searches'].length > 0) {
                  this.savedSearches = data['saved_searches'];
                  this.searchName=[];
                  for(let i=0; i < data['saved_searches'].length; i++) {
                    this.searchName.push(data['saved_searches'][i].name);
                  }

                  setTimeout(() => {
                    $('.selectpicker').selectpicker('refresh');
                  }, 300);

                }

              }

            },
            error => {

            });
      }
      else {
        this.new_error_msg = "Search name already exists.";
        setInterval(() => {
          this.new_error_msg = "" ;
        }, 5000);
      }

    }

  }

  checkNumber(salary) {
    if(!Number(this.preferncesForm.value.current_salary)) {
      return true;
    }
    else {
      return false;
    }

  }

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
          this.setPage(1);
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
          this.company_name = data['company_name'];
        },
        error => {
          if(error['message'] === 500 || error['message'] === 401  )
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            window.location.href = '/login';
          }
          if(error['message'] === 403)
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
    this.job_title_log = '';
    this.location_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.employment_log = '';
    this.job_desc_log = '';
    this.job_offer_log_success = '';
    this.job_offer_log_erorr = '';

    this.authenticationService.getLastJobDesc()
      .subscribe(
        data => {
          let job_offer = data['message'].job_offer;
          setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
          }, 900);
          this.credentials.job_title = job_offer.title;
          this.credentials.salary = job_offer.salary;
          this.credentials.currency = job_offer.salary_currency;
          this.credentials.location = job_offer.location;
          this.credentials.job_type = job_offer.type;
          this.credentials.job_desc = job_offer.description;

        },
        error => {
          if (error['message'] === 500 || error['message'] === 401) {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }

          if (error['message'] === 403) {
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
  job_title_log;
  location_log;
  salary_log;
  salary_currency_log;
  employment_log;
  job_desc_log;
  job_offer_log_success;
  job_offer_log_erorr;

  send_job_offer(msgForm : NgForm){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.job_title_log = '';
    this.location_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.employment_log = '';
    this.job_desc_log = '';
    this.job_offer_log_success = '';
    this.job_offer_log_erorr = '';

    if(!this.credentials.job_title){
      this.job_title_log = 'Please enter job title';
    }
    if(!this.credentials.location){
      this.location_log = 'Please enter location';
    }
    if(!this.credentials.salary){
      this.salary_log = 'Please enter salary';
    }
    if(!this.credentials.currency){
      this.salary_currency_log = 'Please select currency';
    }
    if(!this.credentials.job_type){
      this.employment_log = 'Please select employment type';
    }
    if(!this.credentials.job_desc){
      this.job_desc_log = 'Please enter job description';
    }

    if(this.credentials.job_title && this.credentials.location && this.credentials.currency && this.credentials.job_type && this.credentials.job_desc) {
      if (this.credentials.salary && Number(this.credentials.salary) && (Number(this.credentials.salary)) > 0 && this.credentials.salary % 1 === 0) {
        let job_offer : any = {};
        job_offer.title = this.credentials.job_title;
        job_offer.salary = this.credentials.salary;
        job_offer.salary_currency = this.credentials.currency;
        job_offer.type = this.credentials.job_type;
        job_offer.location = this.credentials.location;
        job_offer.description = this.credentials.job_desc;
        let new_offer : any = {};
        new_offer.job_offer = job_offer;
        this.authenticationService.send_message(this.user_id.id, 'job_offer',new_offer)
          .subscribe(
            data => {
              this.job_offer_log_success = 'Message successfully sent';
              this.credentials.job_title = '';
              this.credentials.salary = '';
              this.credentials.currency = '';
              this.credentials.location = '';
              this.credentials.job_type = '';
              this.credentials.job_desc = '';
              $("#jobDescriptionModal").modal("hide");
              this.router.navigate(['/chat']);
            },
            error => {
              if (error['status'] === 400) {
                this.job_offer_log_erorr = 'You have already sent a job description to this candidate';
              }
              if (error['status'] === 500 || error['status'] === 401) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
              if (error['status'] === 404) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
            }
          );
      }
      else {
        this.salary_log = 'Salary should be a number';
        this.job_offer_log = 'One or more fields need to be completed. Please scroll up to see which ones.';
      }
    }
    else{
      this.job_offer_log = 'One or more fields need to be completed. Please scroll up to see which ones.';
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
    this.job_offer_log_success = '';
    this.job_offer_log_erorr = '';
  }

  sorting(languages){

    return languages.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    })
  }
  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.candidate_data.length, page);
    this.pagedItems = this.candidate_data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  suggestedOptions() {
    if((this.countriesModel && this.countriesModel !== '') || (this.preferncesForm.value.location && this.preferncesForm.value.location !== '')) {
      let searchText;
      if(this.countriesModel) searchText = this.countriesModel;
      if(this.preferncesForm.value.location) searchText = this.preferncesForm.value.location;
      this.authenticationService.autoSuggestOptions(searchText, false)
        .subscribe(
          data => {
            if(data) {
              let citiesInput = data;
              let citiesOptions=[];
              for(let cities of citiesInput['locations']) {
                if(cities['remote'] === true) {
                  citiesOptions.push({name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country;
                  citiesOptions.push({city : cities['city']._id , name : cityString});
                }

              }
              this.cities = this.filter_array(citiesOptions);
            }

          },
          error=>
          {
            if(error['message'] === 500 || error['message'] === 401)
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
  }

  newSearchLocation = [];
  selectedValueFunction(e) {
    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+e+"']")['dataset'].value;

        this.countriesModel = '';

        if(this.preferncesForm) this.preferncesForm.get('location').setValue('');

        this.cities = [];
        if(this.selectedValueArray.length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.selectedValueArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.selectedValueArray.push({city:value2send , name: e});
            else this.selectedValueArray.push({ name: e});
          }
          this.selectedValueArray.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
          if(this.selectedValueArray.find((obj => obj.name === 'Remote'))){
            this.selectedValueArray.splice(0, 0, {name : 'Remote'});
            this.selectedValueArray = this.filter_array(this.selectedValueArray);
          }
          this.newSearchLocation  = this.selectedValueArray;
          this.searchdata('locations' , this.selectedValueArray);
        }
      }
      else {
      }
    }


  }

  deleteLocationRow(index){
    this.selectedValueArray.splice(index, 1);
    this.searchdata('locations' , this.selectedValueArray);
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

  newSearchSelectedValueFunction(e) {
    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+e+"']")['dataset'].value;

        this.countriesModel = '';
        this.preferncesForm.get('location').setValue('');

        this.cities = [];
        if(this.newSearchLocation.length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.newSearchLocation.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.newSearchLocation.push({city:value2send , name: e});
            else this.newSearchLocation.push({ name: e});
          }
          this.newSearchLocation.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
          if(this.newSearchLocation.find((obj => obj.name === 'Remote'))){
            this.newSearchLocation.splice(0, 0, {name : 'Remote'});
            this.newSearchLocation = this.filter_array(this.newSearchLocation);
          }
          //this.searchdata('locations' , this.selectedValueArray);
        }
      }
      else {
      }
    }


  }

  deleteNewLocationRow(index) {
    this.newSearchLocation.splice(index, 1);
  }

}
