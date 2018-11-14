import { Component, OnInit , AfterViewInit} from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-candidate-search',
  templateUrl: './admin-candidate-search.component.html',
  styleUrls: ['./admin-candidate-search.component.css']
})
export class AdminCandidateSearchComponent implements OnInit,AfterViewInit {
  p: number = 1;
  currentUser: User;
  log;
  info=[];
  length;
  page;
  searchWord;
  credentials: any = {};
  job_title;
  public rolesData: Array<Select2OptionData>;
  public options: Select2Options;
  public value;
  public current: string;
  active;
  inactive;
  approve;
  admin_check = [{name:1 , value:"Active"}, {name:0 , value:"Inactive"}];
  information;
  admin_log;
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
    this.response='';
    this.rolesData =
      [
        {id:'job_offer', text:'Job description sent'},
        {id:'is_company_reply', text:'Job description accepted / reject'},
        {id:'interview_offer', text:'Interview request sent'},
        {id:'employment_offer', text:'Employment offer sent'},
        {id:'Employment offer accepted / reject', text:'Employment offer accepted / reject'},

      ];

    this.options = {
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
        this.getAllCandidate();
      else
        this.router.navigate(['/not_found']);
    }
    else
    {
      this.router.navigate(['/not_found']);

    }

  }
  array_data=[];
  getAllCandidate()
  {
    this.length=0;
    this.info=[];
    this.response='';
    this.authenticationService.getAll()
      .subscribe(
        data =>
        {
            this.information = this.filter_array(data);
            this.info=[];
            this.length='';

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
              this.log= 'No candidates matched this search criteria';

            }

            this.length='';

        },
        error =>
        {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log = error['error']['message'];
            this.response = "data";
            this.length='';
            this.info=[];
            this.page='';
          }

        });
  }

  is_approve;
  approveClick(event , approveForm: NgForm)
  {
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

          if(data.success === true )
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
          if(data.is_approved ===0)
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

        error=>
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
  }


  onSearchName(f: NgForm)
  {

    this.search(f.value.word);

  }

  msgtags;
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

    this.length =0;
    this.info=[];
    this.response = "";
    if(this.approve == -1 && !this.select_value && !this.searchWord )
    {
      this.getAllCandidate();
    }

    else
    {
      this.authenticationService.admin_candidate_filter(this.approve , this.select_value, this.searchWord)

        .subscribe(
          data =>
          {

            if(data.error)
            {
              this.response = "data";
              this.length='';
              this.log = data.error;
              this.info=[];
              this.page='';


            }
            else
            {

              this.length =0;
              this.info=[];
              this.information = this.filter_array(data);


              for(let res of this.information)
              {

                this.length++;
                this.info.push(res);

              }

              if(this.length> 0 )
              {

                this.log='';
              }
              else
              {
                this.response = "data";
                this.log= 'No candidates matched this search criteria';
              }

              this.page =this.length;
              this.response = "data";

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

    }


  }

  select_value;
  reset()
  {
    this.msgtags = '';
    this.select_value='';
    this.approve=-1;
    this.info=[];
    this.searchWord='';
    this.getAllCandidate();
  }

  sort(languages){
    return languages.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    })
  }

}
