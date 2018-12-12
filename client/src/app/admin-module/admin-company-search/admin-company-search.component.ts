import { Component, OnInit,AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-company-search',
  templateUrl: './admin-company-search.component.html',
  styleUrls: ['./admin-company-search.component.css']
})
export class AdminCompanySearchComponent implements OnInit,AfterViewInit {

  p: number = 1;
  currentUser: User;
  length;
  info;
  page;
  log;
  rolesData;
  options;
  admin_check = [{name:1 , value:"Active"}, {name:0 , value:"Inactive"}];
  approve;
  msgtags;
  information;
  is_approve;
  select_value='';
  searchWord;
  admin_log;
  is_admin;
  response;

  constructor(private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }
  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
  }
  ngOnInit()
  {
    this.length='';
    this.log='';
    this.approve=-1;
    this.response = '';
    this.rolesData =
      [
        {id:'job_offer', text:'Job description sent'},
        {id:'is_company_reply', text:'Job description accepted / reject'},
        {id:'interview_offer', text:'Interview request sent'},
        {id:'employment_offer', text:'Employment offer sent'},
        {id:'Employment offer accepted / reject', text:'Employment offer accepted / reject'},

      ];

    this.options =
      {
        multiple: true,
        placeholder: 'Message Tags',
        allowClear :true
      }

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }

    if(this.currentUser && this.admin_log )
    {
      if(this.admin_log.is_admin == 1)
        this.getAllCompanies();
      else
        this.router.navigate(['/not_found']);
    }
    else
    {
      this.router.navigate(['/not_found']);

    }
  }

  getAllCompanies()
  {
    this.length=0;
    this.info=[];
    this.response = "";
    this.authenticationService.allCompanies()
      .subscribe(
        data =>
        {
            for(let i=0; i < data['length']; i++)
            {
              this.length++;
              this.info.push(data[i]);

            }

            if(this.length> 0 )
            {
              this.page =this.length;
              this.log='';
              this.response = "data";
            }
            else
            {
              this.log= 'No companies matched this search criteria';
              this.info=[];
              this.response = "data";

            }
            this.length = '';


        },
        error =>
        {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
            this.response = "data";
          }
          else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
            this.response = "data";
          }
          else {
            this.log = "Something getting wrong";
          }
        });
  }

error ;
  approveClick(event , approveForm: NgForm)
  {
    this.error = '';

    if(event.srcElement.innerHTML ==='Active' )
    {
      this.is_approve = 1;
    }
    else if(event.srcElement.innerHTML ==='Inactive')
    {
      this.is_approve =0;
    }

    this.authenticationService.aprrove_user(approveForm.value.id ,this.is_approve )
      .subscribe(
        data =>
        {

          if(data['success'] === true)
          {
            if(event.srcElement.innerHTML ==='Active' )
            {
              event.srcElement.innerHTML="Inactive";
            }
            else if(event.srcElement.innerHTML ==='Inactive')
            {
              event.srcElement.innerHTML="Active";
            }
          }
          else if(data['is_approved'] ===0)
          {
            if(event.srcElement.innerHTML ==='Active' )
            {
              event.srcElement.innerHTML="Inactive";
            }
            else if(event.srcElement.innerHTML ==='Inactive')
            {
              event.srcElement.innerHTML="Active";
            }
          }

        },

        error =>
        {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.error = error['error']['message'];
          }
          else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.error = error['error']['message'];
          }
          else {
            this.error = "Something getting wrong";
          }
        });
  }

  onSearchName(f: NgForm)
  {
    if(f.value.word) {
      this.search(f.value.word);
    }

  }


  messagetag_changed(data)
  {
    if(this.select_value  !== data.value)
    {
      this.select_value = data.value;
      this.search(this.select_value);
    }

  }

  search_approved(event)
  {
    this.approve =event;
    this.search(this.approve);

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

  search(event)
  {
    this.length=0;
    this.page =0;
    this.info=[];
    this.response = "";

    if(this.approve === -1 && !this.select_value && !this.searchWord )
    {
      this.getAllCompanies();

    }
    else
    {

      this.authenticationService.admin_company_filter(this.approve , this.select_value, this.searchWord)
        .subscribe(
          data =>
          {
              this.information = this.filter_array(data);

              for(let res of this.information)
              {

                this.length++;
                this.info.push(res);

              }


              if(this.length> 0 )
              {

                this.log='';
                this.page =this.length;
                this.response = "data";

              }
              else
              {
                this.response = "data";
                this.log= 'No companies matched this search criteria';
              }
          },
          error =>
          {
            if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.response = "data";
              this.length = '';
              this.info = [];
              this.page = '';
              this.log = error['error']['message'];
            }
            else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            {
              this.response = "data";
              this.length = '';
              this.info = [];
              this.page = '';
              this.log = error['error']['message'];
            }
            else {
              this.log = "Something getting wrong";
            }
          });
    }

  }


  reset()
  {
    this.msgtags = '';
    this.select_value='';
    this.approve=-1;
    this.info=[];
    this.searchWord='';
    this.getAllCompanies();

  }


}
