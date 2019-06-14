import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../user.service' ;

@Component({
  selector: 'app-u-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  pageDoc;
  page_name;
  queryPageName;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    this.page_name = '';
    this.route.params.subscribe(params => {
      this.page_name = params['page_name'];
      this.getPages();
    });
  }

  getPages() {
    this.queryPageName = '';
    switch (this.page_name) {
      case "candidate-terms":
        this.queryPageName = "Terms and Condition for candidate";
        break;
      case "company-terms":
        this.queryPageName = "Terms and Condition for company";
        break;
      case "faq":
        this.queryPageName = "FAQ";
        break;
      case "privacy-notice":
        this.queryPageName = "Privacy Notice";
        break;
      default:
        this.router.navigate(['/not_found']);
    }

    this.authenticationService.get_page_content(this.queryPageName)
      .subscribe(
        data => {
          if(data){
            this.pageDoc = data;
          }
        },
        error => {
          // this.router.navigate(['/not_found']);
        }
      );
  }

  ngOnInit() {
  }

}
