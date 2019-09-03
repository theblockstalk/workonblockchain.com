import { Component, OnInit, ElementRef , Input , ViewChild, Inject, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../user.service';
import { DataService } from '../../data.service';
import {NgForm , FormGroup , FormBuilder, FormArray} from '@angular/forms';
import { Router , ActivatedRoute} from '@angular/router';
import { DatePipe,isPlatformBrowser } from '@angular/common';
import {environment} from '../../../environments/environment';
const URL = environment.backend_url;
import {constants} from '../../../constants/constants';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { HowHearAboutWobComponent } from '../../L1-items/users/how-hear-about-wob/how-hear-about-wob.component';
import { HearAboutWobOtherInfoComponent } from '../../L1-items/users/hear-about-wob-other-info/hear-about-wob-other-info.component';
declare var $:any;

@Component({
  selector: 'app-admin-update-company-profile',
  templateUrl: './admin-update-company-profile.component.html',
  styleUrls: ['./admin-update-company-profile.component.css']
})
export class AdminUpdateCompanyProfileComponent implements OnInit {
  @ViewChild(HowHearAboutWobComponent) howHearAboutWob: HowHearAboutWobComponent;
  @ViewChild(HearAboutWobOtherInfoComponent) otherInfo : HearAboutWobOtherInfoComponent;

  @Input() name: string;
  cropperSettings: CropperSettings;
  imageCropData:any;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  info : any;
  currentUser: any;
  log;
  founded_log;
  employee_log;
  funded_log;
  des_log;
  image_src;
  company_founded;
  no_of_employees;
  company_funded;
  company_description;
  last_name;
  first_name;
  job_title;
  company_website;
  company_name;
  company_phone;
  company_country;
  company_city;
  company_postcode;
  image;
  img_data;
  img_src;
  email;
  file_size = 1048576;
  company_postcode_log;
  first_name_log;
  last_name_log;
  job_title_log;
  company_name_log;
  company_website_log;
  company_phone_log;
  company_country_log;
  company_city_log;
  image_log;
  preferncesForm : FormGroup;
  saved_searches=[];
  location_log;
  job_type_log;
  position_log;
  current_currency_log;
  email_notification_log;
  error_msg;
  about_active_class;
  companyMsgTitle;
  current_salary;
  index;
  other_technologies;
  avail_day;
  expected_validation;
  currentyear;
  yearValidation;
  cities;
  selectedValueArray=[];
  error;
  selectedLocations;
  emptyInput;
  when_receive_email_notitfications;
  countries = constants.countries;
  job_types = constants.job_type;
  roles = constants.workRoles;
  currency = constants.currencies;
  blockchain = constants.blockchainPlatforms;
  language_opt = constants.programmingLanguages;
  email_notificaiton = constants.email_notificaiton;
  residenceCountries = constants.countries;
  workTypes = constants.workTypes;
  country_codes = constants.country_codes;
  years_exp = constants.years_exp_min;
  prefData;
  company_id;
  admin_log;
  yearVerification;
  country_code;
  country_code_log;
  contact_number_log;
  imagePreviewLink;
  prefil_image;
  hear_about_wob;otherReasons;discount;
  discount_log;

  constructor(private _fb: FormBuilder ,private datePipe: DatePipe,
              private router: Router ,private route: ActivatedRoute,
              private authenticationService: UserService,
              private dataservice: DataService,
              private el: ElementRef,@Inject(PLATFORM_ID) private platformId: Object) {
    this.route.queryParams.subscribe(params => {
      this.company_id = params['company'];
    });
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.minWidth = 180;
    this.cropperSettings.minHeight = 180;
    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'black';
    this.imageCropData = {};
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 500);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 900);
    }
  }

  initPrefRows()
  {
    return this._fb.group({
      _id :[],
      work_type: [''],
      expected_hourly_rate: [''],
      currency : [''],
      location: [''],
      name: [''],
      visa_needed : [false],
      job_type: [''],
      position: [''],
      current_currency: [''],
      current_salary: [''],
      blockchain: [''],
      skills: [''],
      other_technologies: [''],
      order_preferences: [''],
      residence_country: [''],
      timestamp:[],
      years_exp_min: []
    });
  }

  private preferncesFormData(): FormGroup[]
  {
    return this.prefData
      .map(i => this._fb.group({ work_type: i.work_type , currency: i.current_currency, expected_hourly_rate: i.expected_hourly_rate , timestamp:i.timestamp,_id: i._id, residence_country: [i.residence_country], name: i.name, location: this.selectedCompanyLocation(i.location) , visa_needed : i.visa_needed, job_type: [i.job_type], position: [i.position], current_currency: i.current_currency, current_salary: i.current_salary, blockchain: [i.blockchain], skills: [i.skills], other_technologies: i.other_technologies,years_exp_min: [i.years_exp_min] ,order_preferences: [i.order_preferences] } ));
  }

  selectedCompanyLocation(location) {
    this.selectedValueArray=[];
    if(location && location.length > 0) {
      for (let country1 of location)
      {
        if (country1['remote'] === true) {
          this.selectedValueArray.push({_id:country1['_id'] ,name: 'Remote' });
        }

        if (country1['city']) {
          let city = country1['city'].city + ", " + country1['city'].country;
          this.selectedValueArray.push({_id:country1['_id'] ,city:country1['city']._id ,name: city });
        }
      }

      this.selectedValueArray.sort();
      if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
        let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
        this.selectedValueArray.splice(0, 0, remoteValue);
        this.selectedValueArray = this.filter_array(this.selectedValueArray);
      }
      this.locationArray.push(this.selectedValueArray);
      return '';
    }
    else {
      this.locationArray.push([]);
      return '';
    }
  }

  deletePrefRow(index: number)
  {
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.removeAt(index);
  }

  locationArray = [];
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) $('.selectpicker').selectpicker('refresh');
    this.prefData=[];
    this.company_country=-1;
    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }
    else if(this.currentUser && this.admin_log)
    {
      this.job_types.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
      })

      this.roles.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.blockchain.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.preferncesForm = this._fb.group({
        prefItems: this._fb.array([this.initPrefRows()])
      });
      this.authenticationService.getCurrentCompany(this.company_id, true)
        .subscribe(
          data =>
          {
            if(data)
            {
              console.log(data);
              if(data['_creator'].hear_about_wob) this.hear_about_wob = data['_creator'].hear_about_wob;
              if(data['_creator'].hear_about_wob && data['_creator'].hear_about_wob === 'Other' && data['_creator'].hear_about_wob_other_info) this.otherReasons = data['_creator'].hear_about_wob_other_info;
              this.email = data['_creator'].email;
              this.when_receive_email_notitfications = data['when_receive_email_notitfications'];
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.company_founded = data['company_founded'];
              this.no_of_employees = data['no_of_employees'];
              this.company_funded = data['company_funded'];
              this.company_description = data['company_description'];
              if(data['company_logo'] != null) {
                this.imagePreviewLink = data['company_logo'];
              }
            }

            if(data['discount']) this.discount = data['discount'];

            if(data['first_name'] && data['last_name'] && data['job_title'] && data['company_name'] && data['company_website'] &&
              data['company_phone'] && data['company_postcode'])
            {
              this.first_name= data['first_name'];
              this.last_name=data['last_name'];
              this.job_title =data['job_title'];
              this.company_name=data['company_name'];
              this.company_website=data['company_website'];

              this.company_phone = '';
              let contact_number = data['company_phone'];
              contact_number = contact_number.replace(/^00/, '+');
              contact_number = contact_number.split(" ");
              if(contact_number.length>1) {
                for (let i = 0; i < contact_number.length; i++) {
                  if (i === 0) this.country_code = contact_number[i];
                  else this.company_phone = this.company_phone+''+contact_number[i];
                }
              }
              else this.company_phone = contact_number[0];

              this.company_country=data['company_country'];
              this.company_city =data['company_city'];
              this.company_postcode = data['company_postcode'];

            }

            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                  $('.selectpicker').selectpicker();
                  $('.selectpicker').selectpicker('refresh');
                }, 500);
              }
              this.prefData = data['saved_searches'];
              this.preferncesForm = this._fb.group({
                prefItems: this._fb.array(
                  this.preferncesFormData()
                )
              });

            }
          },
          error =>
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

            if(error['message'] === 403)
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
  validatedLocation;
  country_input_log;
  country_log;
  search_log;
  search_name_log;
  residence_log;
  expected_hourly_rate_log;
  company_profile(profileForm: NgForm)
  {
    let count = 0;
    this.error_msg = "";
    this.contact_number_log = '';

    if(this.company_founded){
      this.company_founded = parseInt(this.company_founded);
    }
    if(!this.first_name) {
      this.first_name_log="Please enter first name";
    }
    if(!this.last_name) {
      this.last_name_log="Please enter last name";
    }
    if(!this.job_title) {
      this.job_title_log="Please enter job title";
    }
    if(!this.company_name) {
      this.company_name_log="Please enter company name";
    }
    if(!this.company_website) {
      this.company_website_log="Please enter company website url";
    }
    if(!this.company_phone) {
      this.company_phone_log="Please enter phone number";
    }
    if (this.company_phone) {
      if(this.company_phone.length < 4 || this.company_phone.length > 15){
        this.contact_number_log = "Please enter minimum 4 and maximum 15 digits";
        count = 1;
      }
      if(!this.checkNumber(this.company_phone)) {
        count = 1;
      }
    }

    if(this.discount && !this.checkNumber(this.discount)) count = 1;
    console.log(profileForm);

    if(!this.country_code){
      this.country_code_log = 'Please select country code';
    }
    if(this.company_country === -1) {
      this.company_country_log="Please select country";
    }
    if(!this.company_city) {
      this.company_city_log="Please enter city name";
    }
    if(!this.company_postcode) {
      this.company_postcode_log="Please enter post code";
    }
    if(!this.company_founded) {
      this.founded_log = 'Please fill when was the company founded';
    }
    if(this.company_founded >  this.currentyear ) {
      this.yearValidation = "Date must be in the past"
    }

    if(this.company_founded < 1800) {
      this.yearValidation = "Please enter value greater than 1800";
    }

    if(!this.no_of_employees) {
      this.employee_log = 'Please fill no. of employees';
    }
    if(!this.company_funded) {
      this.funded_log = 'Please fill how is the company funded';
    }
    if(!this.company_description) {
      this.des_log = 'Please fill Company Description';
    }

    if(this.selectedLocations && this.selectedLocations.length > 10) {
      this.country_log = "Please select maximum 10 locations";
    }

    if(!this.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
    }

    if(this.preferncesForm.value.prefItems.length > 0) {
      for(let i=0 ; i<this.preferncesForm.value.prefItems.length; i++) {
        if(!this.preferncesForm.value.prefItems[i].name) {
          this.search_name_log = 'Please enter search name';
          count = 1;
        }
        if(this.preferncesForm.value.prefItems[i].work_type === 'employee'){
          if(this.preferncesForm.value.prefItems[i].current_salary && this.preferncesForm.value.prefItems[i].current_currency) {
            const checkNumber = this.checkNumber(this.preferncesForm.value.prefItems[i].current_salary);
            if(checkNumber === false) {
              count = 1;
              this.current_currency_log = "Salary should be a number";
            }
            else this.preferncesForm.value.prefItems[i].current_salary = parseInt(this.preferncesForm.value.prefItems[i].current_salary);
          }
          if(this.preferncesForm.value.prefItems[i].current_salary && !this.preferncesForm.value.prefItems[i].current_currency) {
            this.current_currency_log = "Please choose currency ";
            count = 1;
          }
          if(!this.preferncesForm.value.prefItems[i].current_salary && this.preferncesForm.value.prefItems[i].current_currency) {
            this.current_currency_log = "Please enter expected hours ";
            count = 1;
          }
        }

        if(this.preferncesForm.value.prefItems[i].work_type === 'contractor') {
          if(this.preferncesForm.value.prefItems[i].expected_hourly_rate && this.preferncesForm.value.prefItems[i].currency) {
            const checkNumber = this.checkNumber(this.preferncesForm.value.prefItems[i].expected_hourly_rate);
            if(checkNumber === false) {
              count = 1;
              this.expected_hourly_rate_log = "Hourly rate should be a number";
            }
            else this.preferncesForm.value.prefItems[i].expected_hourly_rate =  parseInt(this.preferncesForm.value.prefItems[i].expected_hourly_rate);
          }
          if(this.preferncesForm.value.prefItems[i].expected_hourly_rate && !this.preferncesForm.value.prefItems[i].currency) {
            this.expected_hourly_rate_log = "Please choose currency ";
            count = 1;
          }
          if(!this.preferncesForm.value.prefItems[i].expected_hourly_rate && this.preferncesForm.value.prefItems[i].currency) {
            this.expected_hourly_rate_log = "Please enter expected hours ";
            count = 1;
          }

        }


        if(!this.preferncesForm.value.prefItems[i].job_type && !this.preferncesForm.value.prefItems[i].position && !this.locationArray[i] &&
          !this.preferncesForm.value.prefItems[i].blockchain && !this.preferncesForm.value.prefItems[i].visa_needed &&
          !this.preferncesForm.value.prefItems[i].skills && !this.preferncesForm.value.prefItems[i].residence_country &&
          !this.preferncesForm.value.prefItems[i].current_salary && !this.preferncesForm.value.prefItems[i].current_currency &&
          !this.preferncesForm.value.prefItems[i].expected_hourly_rate && !this.preferncesForm.value.prefItems[i].currency &&
          !this.preferncesForm.value.prefItems[i].other_technologies && !this.preferncesForm.value.prefItems[i].years_exp_min &&
          !this.preferncesForm.value.prefItems[i].order_preferences) {
          this.search_log = 'Please fill atleast one field in job search';
          count = 1;
        }
        if(this.preferncesForm.value.prefItems[i].residence_country && this.preferncesForm.value.prefItems[i].residence_country.length > 50) {
          this.residence_log = "Please select maximum 50 countries";
          count = 1;
        }

      }
    }

    if(count === 0 && this.company_founded && this.company_founded > 1800 && this.company_founded <=  this.currentyear && this.no_of_employees
      && this.company_funded && this.company_description && this.when_receive_email_notitfications &&
      this.first_name && this.last_name && this.job_title && this.company_name && this.company_website &&
      this.company_phone && this.country_code && this.company_country !== -1 && this.company_city && this.company_postcode )  {
      profileForm.value.company_founded = parseInt(profileForm.value.company_founded);
      if(this.howHearAboutWob.howHearAboutWOB) profileForm.value.hear_about_wob = this.howHearAboutWob.howHearAboutWOB;
      if(this.howHearAboutWob.howHearAboutWOB && this.howHearAboutWob.howHearAboutWOB === 'Other' && this.otherInfo.otherInfo) profileForm.value.hear_about_wob_other_info = this.otherInfo.otherInfo;
      else profileForm.value.unset_hear_about_wob_other_info = true;

      if(this.imageCropData.image) {
        const file = this.dataURLtoFile(this.imageCropData.image, this.imageName);
        const formData = new FormData();
        formData.append('company_logo', file);
        this.authenticationService.edit_company_profile(this.company_id ,formData , true)
          .subscribe(
            data => {
              if (data) {
              }
            },
            error => {
              if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
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

      let saved_searches = [];
      if(this.preferncesForm.value.prefItems && this.preferncesForm.value.prefItems.length > 0){
        let i=0;
        for(let key of this.preferncesForm.value.prefItems) {
          let searchQuery : any = {};
          let validLocation = [];

          if(key['visa_needed']) searchQuery.visa_needed = key['visa_needed'];
          else searchQuery.visa_needed = false;
          if(key['job_type']) searchQuery.job_type = key['job_type'];
          if(key['position']) searchQuery.position = key['position'];
          if(key['blockchain']) searchQuery.blockchain = key['blockchain'];
          if(key['skills']) searchQuery.skills = key['skills'];
          if(key['residence_country']) searchQuery.residence_country = key['residence_country'];
          if(key['order_preferences']) searchQuery.order_preferences = key['order_preferences'];
          if(key['_id']) searchQuery._id = key['_id'];

          if(i < this.preferncesForm.value.prefItems.length) {
            if(this.locationArray[i]) {
              for(let location of this.locationArray[i]) {
                if(location.name.includes(', ')) {
                  validLocation.push({_id:location._id,  city: location.city, visa_needed : location.visa_needed });
                }
                if(location.name === 'Remote') {
                  validLocation.push({_id:location._id, remote: true, visa_needed : location.visa_needed });
                }

              }
              searchQuery.location = validLocation;

            }

          }
          if(key['name']) searchQuery.name = key['name'];
          if(key['years_exp_min']) searchQuery.years_exp_min = key['years_exp_min'];
          if(key['work_type']) searchQuery.work_type = key['work_type'];
          if(key['work_type'] === 'employee' && key['current_currency'] && key['current_currency'] !== 'Currency' && key['current_salary']) {
            searchQuery.current_currency = key['current_currency'];
            searchQuery.current_salary = Number(key['current_salary']);
          }

          if(key['work_type']==='contractor' && key['currency'] && key['current_currency'] !== 'Currency' && key['expected_hourly_rate']) {
            searchQuery.expected_hourly_rate = Number(key['expected_hourly_rate']);
            searchQuery.current_currency = key['currency'];
          }
          if(key['other_technologies']) searchQuery.other_technologies = key['other_technologies'];
          saved_searches.push(searchQuery);
          if(key['timestamp']) searchQuery.timestamp = key['timestamp'];

          i++;
        }
      }

      profileForm.value.company_phone = this.country_code +' '+ this.company_phone;
      profileForm.value.saved_searches = saved_searches;

      this.authenticationService.edit_company_profile(this.company_id, profileForm.value, true)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/admin-company-detail'], { queryParams: { user: this.company_id } });
            }

          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.dataservice.changeMessage(error['error']['message']);
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.dataservice.changeMessage(error['error']['message']);
            }
            else {
              this.dataservice.changeMessage("Something went wrong");
            }

          });
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

  suggestedOptions(index) {
    if(this.preferncesForm.value.prefItems[index].location !== '') {
      this.error='';
      this.authenticationService.autoSuggestOptions(this.preferncesForm.value.prefItems[index].location , true)
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


  selectedValueFunction(locValue, index) {
    if(this.cities) {
      let citiesExist = this.cities.find(x => x.name === locValue);
      if(citiesExist) {
        ((this.preferncesForm.get('prefItems') as FormArray).at(index) as FormGroup).get('location').patchValue('');
        this.cities = [];
        if(!this.locationArray[index]) this.locationArray[index] = [];
        if(this.locationArray[index].length > 4) {
          this.error = 'You can select maximum 5 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.locationArray[index].find(x => x.name === locValue)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(citiesExist) this.locationArray[index].push({city:citiesExist.city ,  name: locValue, visa_needed:false});
            else this.locationArray[index].push({ name: locValue, visa_needed:false});
          }
        }

        if(this.locationArray[index].length > 0) {
          this.locationArray[index].sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          })
          if(this.locationArray[index].find((obj => obj.name === 'Remote'))) {
            let remoteValue = this.locationArray[index].find((obj => obj.name === 'Remote'));
            this.locationArray[index].splice(0, 0, remoteValue);
            this.locationArray[index] = this.filter_array(this.locationArray[index]);

          }
        }
      }
    }

  }


  deleteLocationRow(locationIndex, index){
    this.locationArray[index].splice(locationIndex, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  get DynamicWorkFormControls()
  {
    return <FormArray>this['preferncesForm'].get('prefItems');
  }

  addNewSearch()
  {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
        $('.selectpicker').selectpicker('refresh');
      }, 100);
    }
    const control = <FormArray>this.preferncesForm.controls['prefItems'];
    control.push(this.initPrefRows());
  }

  refreshSelectBox() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 300);
    }
  }
  imageName;
  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    this.imageName = file.name;
    myReader.readAsDataURL(file);
  }


  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  imageCropped(key) {
    if(key === 'cancel') {
      this.imageCropData = {};
    }
    if (isPlatformBrowser(this.platformId)) $('#imageModal').modal('hide');
  }
}
