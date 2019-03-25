import { Component, OnInit,ViewChild ,ElementRef,AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;
import {PagerService} from '../../pager.service';
import {constants} from '../../../constants/constants';
import {getFilteredNames} from "../../../services/object";

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit,AfterViewInit {
  currentUser: any;
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
  display_name;
  interview_location = '';
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
  urlParameters : any = {};
  no_value = false;
  saveSearchName;

  constructor(private _fb: FormBuilder , private pagerService: PagerService, private authenticationService: UserService,private route: ActivatedRoute,private router: Router) {
    this.route.queryParams.subscribe(params => {
      if(params['queryBody']) {
        this.urlParameters = JSON.parse(params['queryBody']);
        if(this.urlParameters) {
          this.no_value = true;
          if(this.urlParameters.searchName){
            this.saveSearchName = this.urlParameters.searchName;
          }
          if(this.urlParameters.skills){
            this.skill_value = this.urlParameters.skills;
          }
          if(this.urlParameters.locations){
            this.selectedValueArray = this.urlParameters.locations;
          }
          if(this.urlParameters.visa_needed){
            this.visa_check = this.urlParameters.visa_needed;
          }
          if(this.urlParameters.positions){
            this.role_value = this.urlParameters.positions;
          }
          if(this.urlParameters.blockchains){
            this.blockchain_value = this.urlParameters.blockchains;
          }
          if(this.urlParameters.residence_country){
            this.residence_country = this.urlParameters.residence_country;
          }
          if(this.urlParameters.current_salary && this.urlParameters.current_currency){
            this.salary = this.urlParameters.current_salary;
            this.currencyChange = this.urlParameters.current_currency;
          }
          if(this.urlParameters.blockchainOrder){
            this.blockchain_order = this.urlParameters.blockchainOrder;
          }
          this.searchdata("urlQuery" , this.urlParameters);
        }
      }

    });

  }

  currency = constants.currencies;
  job_type = constants.job_type;
  skillsData = constants.programmingLanguages;
  residenceCountries = constants.countries;
  job_types = constants.position_type;
  rolesData = constants.workRoles;
  blockchainData = constants.blockchainPlatforms;

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
      _id: new FormControl(),
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
      timestamp: new FormControl()
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
      $('.selectpicker').selectpicker('refresh');

     this.populatePopupFields();

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



      this.authenticationService.getCurrentCompany(this.currentUser._id)
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

  populatePopupFields(){
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
  }

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

  fillFields(searches, name) {
    this.selectedValueArray = [];
    for(let key of searches) {
      if(key['name'] === name) {
        this.saveSearchName = name;
        setTimeout(() => {
          $('.selectpicker').selectpicker();
        }, 200);

        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 300);

        if(key['location'])
        {
          this.prefillLocationFEFormat(key['location']);
        }
        if(key['skills']) this.skill_value = key['skills'];
        else this.skill_value = '';

        if(key['_id']) this._id = key['_id'];
        else this._id = '';

        if(key['timestamp']) this.timestamp = key['timestamp'];
        else this.timestamp = '';

        if(key['job_type']) this.pref_job_type = key['job_type'];
        else this.pref_job_type = [];

        if(key['other_technologies']) this.other_technologies = key['other_technologies'];
        else this.other_technologies = '';

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
        $('.selectpicker').selectpicker('refresh');

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
    if(this.newSearchLocation && this.newSearchLocation.length > 0) this.selectedValueArray = this.filter_array(this.newSearchLocation);


    this.populatePopupFields();

    $('.selectpicker').selectpicker('refresh');

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
      if(this.blockchain_order && this.blockchain_order.length > 0) queryBody.blockchainOrder = this.blockchain_order;
      if(this.residence_country && this.residence_country.length > 0) queryBody.residence_country = this.residence_country;
      if(this.salary && this.currencyChange && this.currencyChange !== 'Currency') {
        queryBody.current_salary  = this.salary;
        queryBody.current_currency = this.currencyChange;
      }
      let newQueryBody : any = {};
      newQueryBody = queryBody;
      if(this.saveSearchName) {
        newQueryBody.searchName = this.saveSearchName;
      }

      this.router.navigate(['candidate-search'], {
        queryParams: {queryBody: JSON.stringify(newQueryBody)}
      });

      this.authenticationService.filterSearch(queryBody)
        .subscribe(
          data =>
          {
            this.candidate_data = data;

            this.filterAndSort();

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
              this.log = 'Something went wrong';
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
    this.newSearchLocation = [];
    this.role_value = '';
    this.blockchain_value = '';
    this.currencyChange = '';
    this.visa_check = false;
    this.residence_country = [];
    this.blockchain_order = [];
    this.saveSearchName = '';
    $('.selectpicker').val('default');
    $('.selectpicker').selectpicker('refresh');
    this.router.navigate(['candidate-search'], {});
    this.getVerrifiedCandidate();
  }


  success_msg;
  error_msg;
  _id;
  timestamp;
  pref_job_type;
  other_technologies;
  savedSearch() {
    let queryBody : any = {};
    let index = this.savedSearches.findIndex((obj => obj.name === this.saveSearchName));
    if(this.saveSearchName) queryBody.name = this.saveSearchName;
    if(this.visa_check) queryBody.visa_needed = this.visa_check;
    else queryBody.visa_needed = false;
    if(this.pref_job_type) queryBody.job_type = this.pref_job_type;
    else queryBody.job_type = [];
    if(this.role_value && this.role_value.length > 0 ) queryBody.position = this.role_value;
    else queryBody.position= [];
    if(this.blockchain_value && this.blockchain_value.length > 0) queryBody.blockchain = this.blockchain_value;
    else queryBody.blockchain = [];
    if(this.skill_value && this.skill_value.length > 0) queryBody.skills = this.skill_value;
    else queryBody.skills = [];
    if(this.residence_country && this.residence_country.length > 0 ) queryBody.residence_country = this.residence_country;
    else queryBody.residence_country = [];
    if(this.blockchain_order) queryBody.order_preferences = this.blockchain_order;
    if(this._id) queryBody._id = this._id;
    if(this.selectedValueArray && this.selectedValueArray.length > 0) {
      let validatedLocation =[];
      for(let location of this.selectedValueArray) {
        if(location.name.includes(', ') ) {
          if(location._id) validatedLocation.push({_id: location._id ,city: location.city});
          else validatedLocation.push({city: location.city});
        }
        if(location.name === 'Remote') {
          if(location._id) validatedLocation.push({_id:location._id, remote: true });
          else validatedLocation.push({remote: true });
        }
      }
      queryBody.location = this.filter_array(validatedLocation);
    }
    if(this.saveSearchName) queryBody.name = this.saveSearchName;

    if(this.salary && this.currencyChange) {
      queryBody.current_currency = this.currencyChange;
      queryBody.current_salary  = this.salary;
    }
    if(this.other_technologies) queryBody.other_technologies = this.other_technologies;
    if(this.timestamp) queryBody.timestamp = this.timestamp;

    this.savedSearches[index] = queryBody;
    if(this.saveSearchName) {
    for(let searches of this.savedSearches) {
      if(searches['name'] !== this.saveSearchName) {
        if(searches['location'] && searches['location'].length > 0 ) {
          let cities = [];
          let cityCheck= false;
          for(let city of searches['location'])
          {
            if(city['city'] && city['city']._id ) {
              cityCheck=true;
              cities.push({_id:city['_id'] , city: city['city']._id});
            }
            if(city['remote'] === true) {
              cityCheck=true;
              cities.push(city);
            }

          }
          if(cityCheck === true) searches['location'] = cities;
        }
      }
    }
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
                  if(data['saved_searches'][i].name === this.saveSearchName) this.timestamp = data['saved_searches'][i].timestamp;
                  if(data['saved_searches'][i].location && data['saved_searches'][i].location.length > 0) {
                    this.prefillLocationFEFormat(data['saved_searches'][i].location);
                  }

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

  prefillLocationFEFormat(location) {
    this.selectedValueArray=[];
    for (let country1 of location)
    {
      if (country1['remote'] === true) {
        this.selectedValueArray.push({_id:country1['_id'], name: 'Remote'});
      }

      if (country1['city']) {
        let city = country1['city'].city + ", " + country1['city'].country;
        this.selectedValueArray.push({_id:country1['_id'], city:country1['city']._id ,name: city });
      }
    }

    this.selectedValueArray.sort();
    if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
      this.selectedValueArray.splice(0, 0, remoteValue);
      this.selectedValueArray = this.filter_array(this.selectedValueArray);

    }
  }

  successful_msg;
  new_error_msg;
  residence_country_log;
  savedNewSearch(){
    let queryBody : any = {};
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
    if(this.preferncesForm.value.name) queryBody.name = this.preferncesForm.value.name;
    if(this.preferncesForm.value.position && this.preferncesForm.value.position.length > 0 ) queryBody.position = this.preferncesForm.value.position;
    if(this.preferncesForm.value.job_type && this.preferncesForm.value.job_type.length > 0 ) queryBody.job_type = this.preferncesForm.value.job_type;
    if(this.preferncesForm.value.blockchain && this.preferncesForm.value.blockchain.length > 0) queryBody.blockchain = this.preferncesForm.value.blockchain;
    if(this.preferncesForm.value.visa_needed) queryBody.visa_needed = this.preferncesForm.value.visa_needed;
    if(this.preferncesForm.value.order_preferences) queryBody.order_preferences = this.preferncesForm.value.order_preferences;
    if(this.preferncesForm.value.residence_country) queryBody.residence_country = this.preferncesForm.value.residence_country;
    if(this.preferncesForm.value.current_salary && this.preferncesForm.value.current_currency) {
      queryBody.current_currency = this.preferncesForm.value.current_currency;
      queryBody.current_salary  = this.preferncesForm.value.current_salary;
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
        for(let searches of this.savedSearches) {
          if(searches['name'] !== this.preferncesForm.value.name) {
            if(searches['location'] && searches['location'].length > 0 ) {
              let cities = [];
              for(let city of searches['location'])
              {
                if(city['city'] && city['city']._id ) {
                  cities.push({_id:city['_id'] , city: city['city']._id});
                }
                if(city['remote'] === true) {
                  cities.push(city);
                }

              }
              searches['location'] = cities;
            }
          }
        }
        this.authenticationService.edit_company_profile({'saved_searches' : this.savedSearches})
          .subscribe(
            data => {
              if(data && this.currentUser)
              {
                this.savedSearches= [];
                this.saveSearchName = this.preferncesForm.value.name;
                this.searchdata('name' , this.saveSearchName);
                this.saveSearchName = this.preferncesForm.value.name;
                this.searchdata('searchName' , this.saveSearchName);
                $('#saveNewSearch').modal('hide');

                if(data['saved_searches'] && data['saved_searches'].length > 0) {
                  this.savedSearches = data['saved_searches'];
                  this.searchName = [];
                  for(let i=0; i < data['saved_searches'].length; i++) {
                    this.searchName.push(data['saved_searches'][i].name);
                    if(this.saveSearchName === data['saved_searches'][i].name) {
                      this._id = data['saved_searches'][i]._id;
                      this.timestamp = data['saved_searches'][i].timestamp;
                      this.pref_job_type = data['saved_searches'][i].job_type;
                      this.other_technologies = data['saved_searches'][i].other_technologies;

                      if(data['saved_searches'][i].location && data['saved_searches'][i].location.length > 0) {
                        this.prefillLocationFEFormat(data['saved_searches'][i].location);
                      }

                    }

                    setTimeout(() => {
                      $('.selectpicker').selectpicker('refresh');
                    }, 300);

                  }

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

    this.authenticationService.getVerrifiedCandidate(this.currentUser._id)
      .subscribe(
        dataa => {
          this.candidate_data = dataa;

          this.filterAndSort();

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
            this.log = 'Something went wrong';
          }

        });


    this.authenticationService.getCurrentCompany(this.currentUser._id)
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
                  citiesOptions.push({_id: cities['_id'], name: 'Remote'});
                }
                if(cities['city']) {
                  let cityString = cities['city'].city + ", " + cities['city'].country;
                  citiesOptions.push({_id:cities['_id'] ,city : cities['city']._id , name : cityString});
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
          //else if(this.selectedValueArray.find(x => x.name === 'Remote' && !x.id)){}

          else {
            if(value2send) this.selectedValueArray.push({ city:value2send , name: e});
            else this.selectedValueArray.push({name: e});
          }
          this.selectedValueArray.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
          if(this.selectedValueArray.find((obj => obj.name === 'Remote'))){
            this.selectedValueArray.splice(0, 0, this.selectedValueArray.find(x => x.name === 'Remote'));
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
            this.newSearchLocation.splice(0, 0, this.newSearchLocation.find(x => x.name === 'Remote'));
            this.newSearchLocation = this.filter_array(this.newSearchLocation);
          }
          this.selectedValueArray = this.newSearchLocation;
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

  filterAndSort(){
    let new_roles = constants.workRoles;
    for(let i=0;i<this.candidate_data.length;i++){
      this.candidate_data[i].candidate.roles = getFilteredNames(this.candidate_data[i],new_roles);
    }
  }
}
