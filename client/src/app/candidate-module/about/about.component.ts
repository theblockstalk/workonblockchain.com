import { Component, OnInit,ElementRef, Input,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var synapseThrow: any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {environment} from '../../../environments/environment';
const URL = environment.backend_url;
declare var $:any;
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit,AfterViewInit
{
  currentUser: User;
  log='';
  info: any = {};
  email_data : any ={};
  link='';
  class='';
  resume_class;
  exp_class;
  googleUser;
  linkedinUser;
  active_class;
  job_active_class;
  exp_active_class;
  resume_active_class;
  image_log;
  file_size=1048576;
  error_msg;
  gender =
    [
      "Male",
      "Female"
    ]

  nationality = ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dominican', 'Dutch', 'Dutchman', 'Dutchwoman', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlander', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'];
  term_active_class;
  term_link;
  img_src;
  referred_id;
  job_disable;
  resume_disable;
  exp_disable;
  first_name_log;
  last_name_log;
  contact_name_log;
  nationality_log;
  country_log;
  city_log;
  countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];


  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef)
  {
  }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 500);
  }

  ngOnInit()
  {
    this.info.country=-1;
    this.job_disable = "disabled";
    this.resume_disable = "disabled";
    this.exp_disable = "disabled";
    this.info.nationality=-1;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.googleUser = JSON.parse(localStorage.getItem('googleUser'));

    this.linkedinUser = JSON.parse(localStorage.getItem('linkedinUser'));

    if(this.googleUser)
    {
      this.info.image_src = this.googleUser.photoUrl;
      if( this.info.image_src)
      {
        let x = this.info.image_src.split("/");

        let last:any = x[x.length-1];

        this.img_src = last;
      }
      this.info.first_name= this.googleUser.firstName;
      this.info.last_name = this.googleUser.lastName;
    }

    if(!this.currentUser)
    {
      this.router.navigate(['/signup']);
    }

    if(this.currentUser && this.currentUser.type=='candidate')
    {

      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data =>
          {
            console.log(data);
            if(data['refered_id']) //&& !data.first_name && !data.last_name)
            {
              this.referred_id = data['refered_id'];

            }
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }

            if(data['contact_number']  || data['nationality'] || data['first_name'] || data['last_name'] || data['candidate'])
            {

              this.info.contact_number = data['contact_number'];
              this.info.github_account = data['github_account'];
              this.info.exchange_account = data['stackexchange_account'];
              if(data['nationality'])
              {
                this.info.nationality = data['nationality'];
              }
              if(data['candidate'] && data['candidate'].base_country)
              {
                this.info.country = data['candidate'].base_country;
              }
              if(data['candidate'] && data['candidate'].base_city){
                this.info.city = data['candidate'].base_city;
              }

              this.info.first_name =data['first_name'];
              this.info.last_name =data['last_name'];

              if(data['image'] != null )
              {
                this.info.image_src = data['image'] ;


                let x = this.info.image_src.split("/");

                let last:any = x[x.length-1];

                this.img_src = last;

              }

            }

            if(data['contact_number']  && data['nationality'] && data['first_name'] && data['last_name'])
            {
              this.active_class='fa fa-check-circle text-success';
              this.job_disable = '';
              this.link= "/job";
            }

            if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas && data['candidate'].expected_salary && data['candidate'].availability_day)
            {
              this.resume_disable = '';
              this.job_active_class = 'fa fa-check-circle text-success';
              this.resume_class="/resume";
            }

            if(data['candidate'].why_work )
            {
              this.exp_disable = '';
              this.resume_class="/resume";
              this.exp_class = "/experience";
              this.resume_active_class='fa fa-check-circle text-success';
            }

            if( data['candidate'].description)
            {
              this.exp_class = "/experience";
              this.exp_active_class = 'fa fa-check-circle text-success';
            }



          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
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
              // this.router.navigate(['/not_found']);
            }
          });
      this.router.navigate(['/about']);
    }
    else
    {
      this.router.navigate(['/not_found']);
    }

  }

  about() {
    this.error_msg = "";
    if (this.referred_id) {
      this.info.referred_id = this.referred_id;
    }
    if (!this.info.first_name) {
      this.first_name_log = "Please enter first name";

    }
    if (!this.info.last_name) {
      this.last_name_log = "Please enter last name";

    }
    if (!this.info.contact_number) {
      this.contact_name_log = "Please enter contact number";
    }

    if (this.info.nationality === -1) {
      this.nationality_log = "Please choose nationality";
    }
    if (this.info.country === -1) {
      this.country_log = "Please choose base country";
    }
    if (!this.info.city) {
      this.city_log = "Please enter base city";
    }
    if (this.info.first_name && this.info.last_name && this.info.contact_number && this.info.nationality != -1 && this.info.city && this.info.country != -1) {
      this.authenticationService.about(this.currentUser._creator, this.info)
        .subscribe(
          data => {
            if (data['success']) {

              if (this.info.image) {

                let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
                let fileCount: number = inputEl.files.length;
                let formData = new FormData();
                if (fileCount > 0) {
                  if (inputEl.files.item(0).size < this.file_size) {
                    formData.append('photo', inputEl.files.item(0));
                    this.authenticationService.uploadCandImage(formData)
                    .subscribe(
                      data => {
                        if (data['success']) {
                          this.router.navigate(['/job']);
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
                  else {
                    this.image_log = "Image size should be less than 1MB";
                  }
                }
                else {
                  this.router.navigate(['/job']);
                }
              }
              else {
                this.router.navigate(['/job']);
              }
            }
          },
          error => {
            if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              window.location.href = '/not_found';
            }
          });
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }

  /*referred_email()
  {
    if(this.referred_id)
    {
      this.email_data.referred_id = this.referred_id;
      this.email_data.referred_fname = this.info.first_name;
      this.email_data.referred_lname = this.info.last_name;

      this.authenticationService.email_referred_user(this.email_data).subscribe(
        data =>
        {
          if(data.success === true)
          {

          }
          else
          {

          }

        });

    }
    else {

    }
<<<<<<< HEAD
  }*/
  verify_email()
  {

    if(this.currentUser.email)
    {

      this.authenticationService.verify_client(this.currentUser.email)
        .subscribe(
          data => {
          },
          error => {

          });

    }

  }


}

