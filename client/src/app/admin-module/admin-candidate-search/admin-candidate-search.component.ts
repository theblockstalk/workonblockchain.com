import { Component, OnInit , AfterViewInit} from '@angular/core';
import {UserService} from '../../user.service';
import {NgForm} from '@angular/forms';
import {User} from '../../Model/user';
import { Router, ActivatedRoute } from '@angular/router';
import {PagerService} from '../../pager.service';
declare var $:any;
import {constants} from '../../../constants/constants';
import {getFilteredNames, priorityMilestonReached, twoDayMilestonReached, setBadge, candidateBadge} from "../../../services/object";
import {formatDate} from '@angular/common';

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
  public value;
  public current: string;
  active;
  inactive;
  approve;
  admin_check = constants.candidateStatus;
  admin_checks_email_verify = constants.admin_checks_email_verify;
  admin_checks_candidate_account = constants.admin_checks_candidate_account;
  information;
  admin_log;
  response;
  candidate_status;
  candidate_status_account;
  pager: any = {};
  pagedItems: any[];
  msgTagsOptions = constants.chatMsgTypes;

  constructor(private pagerService: PagerService, private authenticationService: UserService,private route: ActivatedRoute,private router: Router) { }
  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
  }
  ngOnInit()
  {
    this.length=0;
    this.log='';
    this.response='';
    this.candidate_status = 1;
    this.candidate_status_account = false;

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
    if(!this.currentUser)
    {
      this.router.navigate(['/login']);
    }

    if(this.currentUser && this.admin_log )
    {
      if(this.admin_log.is_admin === 1)
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
          this.length=0;

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
          for(let i=0;i<this.info.length;i++) {
            this.info[i].candBadge = candidateBadge(this.info[i].candidate);
          }
          console.log(this.info);
          this.setPage(1);
          this.length=0;

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

  onSearchName(f: NgForm)
  {

    if(f.value.word) {
      this.search(f.value.word);
    }

  }


  msgtags;
  messagetag_changed(data)
  {
    this.search(data);
  }

  search_approved(event)
  {
    this.approve =event;
    this.search(this.approve);
  }

  search_account_status(event)
  {
    this.candidate_status = event;
    this.search(this.candidate_status);
  }

  search_candidate_account_status(event)
  {
    this.candidate_status_account = event;
    this.search(this.candidate_status_account);
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
    if(!this.approve && !this.msgtags && !this.searchWord && !this.candidate_status && !this.candidate_status_account)
    {
      this.getAllCandidate();
    }

    else
    {
      let queryBody : any = {};
      if(this.approve) queryBody.status = this.approve;
      if(this.msgtags && this.msgtags.length > 0) queryBody.msg_tags = this.msgtags;
      if(this.searchWord && this.searchWord.length > 0) queryBody.name = this.searchWord;
      if(this.candidate_status) queryBody.is_verify = this.candidate_status;
      if(this.candidate_status_account === true || this.candidate_status_account === 'true') queryBody.disable_account = true;
      else if(this.candidate_status_account === false || this.candidate_status_account === 'false') queryBody.disable_account = false;

      this.authenticationService.admin_candidate_filter(queryBody)
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
            this.setPage(1);


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
              this.log = "Something went wrong";
            }
          });

    }


  }

  select_value;
  reset()
  {
    this.msgtags = '';
    this.approve='';
    this.info=[];
    this.searchWord='';
    this.candidate_status = '';
    this.candidate_status_account = '';
    $('.selectpicker').val('default');
    $('.selectpicker').selectpicker('refresh');
    this.getAllCandidate();
  }

  sorting(languages){
    return languages.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    })
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.info.length, page);
    this.pagedItems = this.info.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }

  rolesData = constants.workRoles;
  filterAndSort(roles) {
    return getFilteredNames(roles, this.rolesData);
  }

  /*setBadge(text, classColour, index) {
    let candBadge : any = {};
    candBadge.candidate_badge = text;
    candBadge.candidate_badge_color = classColour;
    return candBadge;
  }*/
}
