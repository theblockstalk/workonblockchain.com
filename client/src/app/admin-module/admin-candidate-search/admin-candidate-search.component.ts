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
  admin_check = [
    {value:'created', name:'Created'},
    {value:'wizard completed', name:'Wizard Completed'},
    {value:'approved', name:'Approved'},
    {value:'rejected', name:'Rejected'},
    {value:'deferred', name:'Deferred'},
    {value:'other', name:'Other'}
  ];
  admin_checks_new = [
    {value:1, name:'Verified'},
    {value:true, name:'Disabled'}
  ];
  information;
  admin_log;
  response;
  candidate_status;

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
    this.candidate_status = -1;
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
  error;
  approveClick(event , approveForm: NgForm)
  {
    this.error = '';
    let reason = '';
    if(event.srcElement.innerHTML ==='Active' )
    {
      this.is_approve = 'approved';
    }
    else if(event.srcElement.innerHTML === 'Inactive')
    {
      this.is_approve = 'rejected';
      reason = 'garbage';
    }

    this.authenticationService.approve_candidate(approveForm.value.id ,this.is_approve,reason)
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
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.error = error['error']['message'];
          }
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
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

  search_account_status(event)
  {
    console.log(event);
    this.candidate_status = event;
    this.search(this.candidate_status);
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
    if(this.approve == -1 && !this.select_value && !this.searchWord && this.candidate_status === -1)
    {
      this.getAllCandidate();
    }

    else
    {
      this.authenticationService.admin_candidate_filter(this.approve , this.select_value, this.searchWord, this.candidate_status)
      .subscribe(
        data =>
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

  select_value;
  reset()
  {
    this.msgtags = '';
    this.select_value='';
    this.approve=-1;
    this.info=[];
    this.searchWord='';
    this.candidate_status = -1;
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
