import { Component, OnInit,ElementRef, Input  , AfterViewInit} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from "../data.service";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//const URL = 'http://workonblockchain.mwancloud.com:4000/';
//const URL = 'http://localhost:4000/';
import {environment} from '../../environments/environment';
const URL = environment.backend_url;
////console.log(URL);


@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css']
})
export class EditCompanyProfileComponent implements OnInit  {
        
   info : any;
    currentUser: User;log;
    founded_log;employee_log;funded_log;des_log;image_src;
    company_founded;no_of_employees;company_funded;company_description;
    last_name;first_name;job_title;company_website;company_name;company_phone;
    company_country;company_city;company_postcode;image;
    img_data;
    img_src;
    email;
    countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];


 constructor(private route: ActivatedRoute,
        private router: Router,private http: HttpClient,
        private authenticationService: UserService,private dataservice: DataService,private el: ElementRef) {
       }
    

  ngOnInit()
  {
      this.company_country=-1;
       this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
       if(!this.currentUser)
       {
          this.router.navigate(['/login']);
       }
       else if(this.currentUser && this.currentUser.type=='company')
       {
            this.authenticationService.getCurrentCompany(this.currentUser._id)
            .subscribe(
                data => 
                {
                    if(data)
                    {
                        this.email = data._creator.email;
                    }
                  //console.log(data[0]);
                  if(data.company_founded && data.no_of_employees && data.company_funded && data.company_description)
                  {
                     this.company_founded=data.company_founded;
                     this.no_of_employees=data.no_of_employees;
                     this.company_funded=data.company_funded;
                     this.company_description =data.company_description;
                       if(data.company_logo != null){
                      
                           this.img_data  =  data.company_logo;

                        let x = this.img_data.split("/");
     
                        let last:any = x[x.length-1];
                           
                           this.img_src = last;
                           }
                       
                      //this.router.navigate(['/login']);
                  }
                
                  if(data.first_name && data.last_name && data.job_title && data.company_name && data.company_website &&
                  data.company_phone && data.company_postcode)
                  {
                     this.first_name= data.first_name;
                      this.last_name=data.last_name;
                      this.job_title =data.job_title;
                      this.company_name=data.company_name;
                      this.company_website=data.company_website;
                      this.company_phone=data.company_phone;
                      this.company_country=data.company_country;
                      this.company_city =data.company_city;
                      this.company_postcode = data.company_postcode;
                     
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
                        this.router.navigate(['/not_found']);                        
                    }
                  
                });
       }
      else
       {
           
           this.router.navigate(['/not_found']);
           
           }
      
  }
    company_postcode_log;
    first_name_log;
    last_name_log;
    job_title_log;
    company_name_log;
    company_website_log;
    company_phone_log;
    company_country_log;
    company_city_log;
    
  company_profile(profileForm: NgForm)
  {
      //console.log(profileForm.value);
    if(!this.first_name)
    {
        this.first_name_log="Please enter first name";
    
    }
      
    if(!this.last_name)
    {
        this.last_name_log="Please enter first name";
    
    }
      
    if(!this.job_title)
    {
        this.job_title_log="Please enter first name";
    
    }
      
    if(!this.company_name)
    {
        this.company_name_log="Please enter first name";
    
    }
      
    if(!this.company_website)
    {
        this.company_website_log="Please enter first name";
    
    }
      
    if(!this.company_phone)
    {
        this.company_phone_log="Please enter first name";
    
    }
      
    if(this.company_country==-1)
    {
        this.company_country_log="Please enter company name";
    
    }
    if(!this.company_city)
    {
        this.company_city_log="Please enter city name";
    
    }
    if(!this.company_postcode)
    {
        this.company_postcode_log="Please enter post code";
    
    }
      if(this.first_name && this.last_name && this.job_title && this.company_name && this.company_website &&
      this.company_phone && this.company_country!=-1 && this.company_city && this.company_postcode)
          
      {
       this.authenticationService.edit_company_profile(this.currentUser._creator,profileForm.value)
            .subscribe(
                data => {
                if(data && this.currentUser)
                {
                     let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#aa');
                     let fileCount: number = inputEl.files.length;
                     let formData = new FormData();
                     if (fileCount > 0 ) 
                     { 
                        formData.append('photo', inputEl.files.item(0));
                    
                        this.http.post(URL+'users/employer_image', formData, {
                        headers: new HttpHeaders().set('Authorization', this.currentUser.jwt_token)
                        }).map((res) => res).subscribe(                
                        (success) => 
                        {
                            //console.log(success);
                            this.router.navigate(['/company_profile']); 
                        },
                        (error) => {
                        if(error.message == 500)
                        {
                            localStorage.setItem('jwt_not_found', 'Jwt token not found');
                            window.location.href = '/login';
                        }    
                        })
                     }
                     else
                          this.router.navigate(['/company_profile']);
                         // window.location.href = '/company_profile';

                       
                }

                if(data.error)
                {
                    //this.log=data.error;
                    this.dataservice.changeMessage(data.error);
                }
               
                },
                error => {
                     this.dataservice.changeMessage(error);
                  this.log = 'Something getting wrong';
                   
                });
          }
  }

}
