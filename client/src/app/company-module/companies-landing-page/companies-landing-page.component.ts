import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-companies-landing-page',
  templateUrl: './companies-landing-page.component.html',
  styleUrls: ['./companies-landing-page.component.css']
})
export class CompaniesLandingPageComponent implements OnInit, AfterViewInit {

  approvedUsers;
  blockchainExperienceUsers;

  constructor(private route: ActivatedRoute,private router: Router, private authenticationService: UserService,private titleService: Title,private newMeta: Meta) {
    this.titleService.setTitle('Hire and contract developers and blockchain enthusiasts to work on your blockchain project now!');
    this.newMeta.updateTag({ name: 'description', content: 'Hire and contract developers, designers and other technical professionals to work on blockchain projects! Search through talent that are passionate about blockchain technology for free and approach them at your leisure.' });

    this.route.queryParams.subscribe(params => {
      let ref_code = params['code'];
      if(ref_code) {
        localStorage.setItem('ref_code', ref_code);
      }
    });
  }

  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
  }

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
            this.blockchainExperienceUsers = Math.floor((data['blockchainExperienceUsers'] / data['approvedUsers'])*100) + "%";
          }
        });
  }

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

}
