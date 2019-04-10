import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Title, Meta } from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  credentials: any = {};
  button_status = '';
  currentUser: User;
  log_error; log_success;
  data;result;
  constructor( private route: ActivatedRoute,
               private router: Router,
               private authenticationService: UserService,private titleService: Title,private newMeta: Meta) {
    this.titleService.setTitle('Work on blockchain today! Learning, freelance and jobs for developers and blockchain enthusiasts.');
    this.route.queryParams.subscribe(params => {
      let ref_code = params['code'];
      if(ref_code) {
        localStorage.setItem('ref_code', ref_code);
      }
    });
  }
  ngAfterViewInit(): void
  {
    $('.carousel').carousel({
      interval: 3500
    });
    window.scrollTo(0, 0);
  }
  ngOnInit()
  {
    this.newMeta.updateTag({ name: 'description', content: 'Work for full-time, part-time, freelance, volunteers and agencies in the best blockchain projects! Opportunities and jobs for developers, designers and other technical professionals on public and enterprise blockchain technology.' });
    this.newMeta.updateTag({ name: 'keywords', content: 'blockchain developers work recruitment jobs' });
    $('#text').html($('.active > .carousel-caption').html());
    $('.slide').on('slid.bs.carousel', function () {
      $('#text').html($('.active > .carousel-caption').html());
    });

  }

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

  subscribe_modal_show(subscribeForm: NgForm) {
    this.button_status="submit";
    $("#subscribeModal").modal("show");
  }

  subscribe(subForm: NgForm) {
    this.button_status="submit";
    this.log_success = '';
    this.log_error = '';
    if(this.credentials.first_name && this.credentials.last_name && this.credentials.email && this.credentials.notice){
      this.authenticationService.add_to_subscribe_list(this.credentials.first_name,this.credentials.last_name,this.credentials.email)
      .subscribe(
        data => {
          this.log_success = 'Successfully added';
        },
        error => {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log_error = error['error']['message'];
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log_error = error['error']['message'];
          }
          else {
            this.log_error = 'Something went wrong';
          }
        }
      );
    }
  }

}
