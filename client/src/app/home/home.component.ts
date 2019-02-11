import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Title, Meta } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentUser: User;
  log;
  data;result;
  constructor( private route: ActivatedRoute,
               private router: Router,
               private authenticationService: UserService,private titleService: Title,private newMeta: Meta) {
    this.titleService.setTitle('Work on Blockchain | A recruitment hiring platform for blockchain developers');
    this.route.queryParams.subscribe(params => {
      console.log(params['code']);
      localStorage.setItem('ref_code', params['code']);
      console.log(JSON.parse(localStorage.getItem('ref_code')));
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
    this.newMeta.updateTag({ name: 'description', content: 'Global blockchain agnostic recruitment hiring platform for blockchain developers, software developers, designers, product managers, CTOs, researchers and software engineer interns who are passionate about public and enterprise blockchain technology and cryptocurrencies. On workonblockchain.com, companies apply to active candidates looking for jobs.' });
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

}
