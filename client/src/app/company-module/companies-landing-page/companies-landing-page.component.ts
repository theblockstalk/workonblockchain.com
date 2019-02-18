import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-companies-landing-page',
  templateUrl: './companies-landing-page.component.html',
  styleUrls: ['./companies-landing-page.component.css']
})
export class CompaniesLandingPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    $('.carousel').carousel({
      interval: 3500
    });
    $('#text').html($('.active > .carousel-caption').html());
    $('.slide').on('slid.bs.carousel', function () {
      $('#text').html($('.active > .carousel-caption').html());
    });
  }

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

}
