import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { Title, Meta } from '@angular/platform-browser';
import {isPlatformBrowser} from "@angular/common";

declare var $: any;

@Component({
  selector: 'app-companies-landing-page',
  templateUrl: './companies-landing-page.component.html',
  styleUrls: ['./companies-landing-page.component.css']
})
export class CompaniesLandingPageComponent implements OnInit, AfterViewInit {

  approvedUsers;
  blockchainExperienceUsers;
  totalCandidates;

  constructor(private route: ActivatedRoute,private router: Router, private authenticationService: UserService,private titleService: Title,private newMeta: Meta,@Inject(PLATFORM_ID) private platformId: Object) {
    this.titleService.setTitle('Hire developers today. Work and jobs platform for blockchain, cryptocurrency and DLT projects');
    this.newMeta.updateTag({ name: 'description', content: 'Hire and contract talent for blockchain, cryptocurrency and DLT. Jobs, freelancers, agencies, developers, CTOs and more with or without blockchain experience.' });
    this.newMeta.updateTag({ name: 'title', content: 'Hire developers today. Work and jobs platform for blockchain, cryptocurrency and DLT projects' });
    this.newMeta.updateTag({ name: 'keywords', content: 'Blockchain developers jobs work, Cryptocurrency, DLT Talent hiring agency salary' });

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
    if (isPlatformBrowser(this.platformId)) {
      $('.carousel').carousel({
        interval: 3500
      });
      $('#text').html($('.active > .carousel-caption').html());
      $('.slide').on('slid.bs.carousel', function () {
        $('#text').html($('.active > .carousel-caption').html());
      });
    }
    this.authenticationService.get_users_statistics()
      .subscribe(
        data => {
          if(data) {
            this.approvedUsers = data['approvedEnabled']['count'];
            this.blockchainExperienceUsers = Math.floor((data['approvedEnabled']['aggregated']['commercial_skills'] / data['approvedEnabled']['count'])*100) + "%";
            this.totalCandidates = data['approvedEnabled']['totalCandidates'];
          }
        });
  }

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

}
