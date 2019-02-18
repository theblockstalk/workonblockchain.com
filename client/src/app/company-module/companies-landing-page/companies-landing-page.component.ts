import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../user.service';

declare var $: any;

@Component({
  selector: 'app-companies-landing-page',
  templateUrl: './companies-landing-page.component.html',
  styleUrls: ['./companies-landing-page.component.css']
})
export class CompaniesLandingPageComponent implements OnInit {

  constructor(private router: Router, private authenticationService: UserService) { }
  approvedUsers;
  blockchainExperienceUsers;

  ngOnInit() {
    $('.carousel').carousel({
      interval: 3500
    });
    $('#text').html($('.active > .carousel-caption').html());
    $('.slide').on('slid.bs.carousel', function () {
      $('#text').html($('.active > .carousel-caption').html());
    });
    this.authenticationService.get_users_statistics()
      .subscribe(
        data => {
          if(data)
          {
            this.approvedUsers = data['approvedUsers'];
            this.blockchainExperienceUsers = data['blockchainExperienceUsers'];
          }
        });
  }

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

}
