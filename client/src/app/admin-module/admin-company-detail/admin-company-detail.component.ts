import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-admin-company-detail',
  templateUrl: './admin-company-detail.component.html',
  styleUrls: ['./admin-company-detail.component.css']
})
export class AdminCompanyDetailComponent implements OnInit {

  user_id;
  currentUser: User;
  info=[];
  credentials: any = {};
  approve;
  verify;
  is_approved;
  error;
  is_approve;
  admin_log;
  imgPath;


  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
  }

  company_website;
  response;
  referred_name;
  referred_link;
  detail_link;
  error_message;
  saved_searche;
  countries;
  selectedValueArray=[];
  ngOnInit()
  {
    this.referred_link = "";
    this.referred_name = "";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
    this.credentials.user_id = this.user_id;
    this.error ='';

    if(this.user_id && this.admin_log.is_admin === 1 && this.currentUser)
    {
      this.authenticationService.getCurrentCompany(this.user_id)
        .subscribe(
          data =>
          {
              this.info.push(data);
              this.approve = data['_creator'].is_approved;
              this.verify =data['_creator'].is_verify;
              if(data['_creator'].referred_email) {
                this.authenticationService.getReferenceDetail(data['_creator'].referred_email)
                  .subscribe(
                    refData => {
                      if (refData['candidateDoc']) {
                        this.referred_name = refData['candidateDoc'].first_name + " " + refData['candidateDoc'].last_name;
                        this.detail_link = '/admin-candidate-detail';
                        this.referred_link = refData['candidateDoc']._id;
                      }
                      else if (refData['companyDoc']) {
                        this.referred_name = refData['companyDoc'].first_name + " " + refData['companyDoc'].last_name;
                        this.detail_link = '/admin-company-detail';
                        this.referred_link = refData['companyDoc']._creator._id;
                      }
                      else {
                        this.referred_name = refData['refDoc'].email;
                      }

                    },
                    error => {
                      if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                      {
                        this.error = error['error']['message'];
                      }
                      else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                      {
                        this.error = error['error']['message'];
                      }
                      else
                      {
                        this.error = error['error']['message'];
                      }
                    }
                  );
              }
              if(data['company_logo'] != null )
              {
                this.imgPath = data['company_logo'];
              }

              if(data['company_website'])
              {
                let loc= data['company_website'];
                let x = loc.split("/");
                if(x[0] === 'http:' || x[0] === 'https:')
                {
                  this.company_website = data['company_website'];
                }
                else
                {
                  this.company_website = 'http://' + data['company_website'];
                }
              }
              if(this.approve === 1)
              {
                this.is_approved = "Aprroved";
              }

              else
              {
                this.is_approved = "";
              }


          },
          error =>
          {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.error = error['error']['message'];
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.error = error['error']['message'];
            }
            else {
              this.error = "Something went wrong";
            }
          });
    }
    else
    {
      this.router.navigate(['/not_found']);

    }
  }

  approveClick(event , approveForm: NgForm)
  {
    this.error = '';
    if(event.srcElement.innerHTML ==='Approve' )
    {
      this.is_approve = 1;
    }
    else if(event.srcElement.innerHTML ==='Disapprove')
    {
      this.is_approve =0;
    }

    this.authenticationService.aprrove_user(approveForm.value.id ,this.is_approve , true)
      .subscribe(
        data =>
        {

          if(data['success'] === true)
          {

            if(event.srcElement.innerHTML ==='Approve' )
            {
              event.srcElement.innerHTML="Disapprove";
              this.is_approved = "Aprroved";
            }
            else if(event.srcElement.innerHTML ==='Disapprove')
            {
              event.srcElement.innerHTML="Approve";
              this.is_approved = "";
            }
          }
          else if(data['is_approved'] === 0)
          {
            if(event.srcElement.innerHTML ==='Approve' )
            {
              event.srcElement.innerHTML="Disapprove";
              this.is_approved = "Aprroved";
            }
            else if(event.srcElement.innerHTML ==='Disapprove')
            {
              event.srcElement.innerHTML="Approve";
              this.is_approved = "";
            }
          }

        },

        error =>
        {

            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.error = error['error']['message'];
            }
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.error = error['error']['message'];
          }
          else {
              this.error = "Something went wrong";
          }
            // this.router.navigate(['/not_found']);

        });
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  getLocation(location) {
    this.selectedValueArray = [];
    for (let country1 of location)
    {
      let locObject : any = {}
      if (country1['remote'] === true) {
        this.selectedValueArray.push({name: 'Remote'});

      }

      if (country1['city']) {
        let city = country1['city'].city + ", " + country1['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        this.selectedValueArray.push(locObject);
      }

    }
    this.countries = this.selectedValueArray;
    this.countries.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
    if(this.countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
      this.countries.splice(0, 0, remoteValue);
      this.countries = this.filter_array(this.countries);

    }

    return this.countries;

  }

}
