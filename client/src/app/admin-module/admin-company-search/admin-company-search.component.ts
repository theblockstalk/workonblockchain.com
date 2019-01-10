import { Component, OnInit,AfterViewInit } from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
import {PagerService} from '../../pager.service';
declare var $:any;

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
  admin_check = [{name:1 , value:"Approved"}, {name:0 , value:"Not approved"}];
  approve;
  msgtags;
  information;
  is_approve;
  select_value='';
  searchWord;
  admin_log;
  is_admin;
  response;
  pager: any = {};
  pagedItems: any[];
  msgTagsOptions =
    [
      {value:'normal', name:'Normal' , checked:false},
      {value:'job_offer', name:'Job offer sent' , checked:false},
      {value:'job_offer_accepted', name:'Job offer accepted' , checked:false},
      {value:'job_offer_rejected', name:'Job offer rejected' , checked:false},
      {value:'interview_offer', name:'Interview offer sent' , checked:false},
      {value:'employment_offer', name:'Employment offer sent' , checked:false},
      {value:'employment_offer_accepted', name:'Employment offer accepted' , checked:false},
      {value:'employment_offer_rejected', name:'Employment offer rejected' , checked:false},
    ];

  constructor(private pagerService: PagerService , private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }
  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
  }
  ngOnInit()
  {
    this.length='';
    this.log='';
    this.response = '';

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
            this.setPage(1);
          }
          else
          {
            this.log= 'No companies matched this search criteria';
            this.info=[];
            this.response = "data";

          }
          this.length = '';
          this.setPage(1);

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

  onSearchName(f: NgForm)
  {
    if(f.value.word) {
      this.search(f.value.word);
    }

  }


  messagetag_changed(data)
  {
    this.search(data);
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

    if(!this.approve && !this.msgtags && !this.searchWord )
    {
      this.getAllCompanies();

    }
    else
    {
      let queryBody : any = {};
      if(this.approve) queryBody.is_approve = this.approve;
      if(this.msgtags && this.msgtags.length > 0) queryBody.msg_tags = this.msgtags;
      if(this.searchWord && this.searchWord.length > 0) queryBody.word = this.searchWord;

      this.authenticationService.admin_company_filter(queryBody)
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
              this.setPage(1);

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
    this.approve = '';
    this.info=[];
    this.searchWord='';
    $('.selectpicker').val('default');
    $('.selectpicker').selectpicker('refresh');
    this.getAllCompanies();

  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.info.length, page);
    this.pagedItems = this.info.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  company_website;
  websiteUrl(link){
    let loc = link;
    let x = loc.split("/");
    if(x[0] === 'http:' || x[0] === 'https:')
    {
      this.company_website = link;
      return this.company_website;
    }
    else
    {
      this.company_website = 'http://' + link;
      return this.company_website;
    }
  }


}
