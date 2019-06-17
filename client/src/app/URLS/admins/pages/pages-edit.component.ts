import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../user.service' ;

@Component({
  selector: 'app-u-admin-pages',
  templateUrl: './pages-edit.component.html',
  styleUrls: ['./pages-edit.component.css']
})
export class PagesEditComponent implements OnInit {
  pageDoc;
  page_name;
  queryPageName;
  admin;
  currentUser;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    this.route.params.subscribe(params => {
      this.page_name = params['page_name'];
    });
  }

  ngOnInit() {
    this.admin = JSON.parse(localStorage.getItem('admin_log'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.admin && this.currentUser) {
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
        case "candidate-popup-message":
          this.queryPageName = "Candidate popup message";
          break;
        case "company-popup-message":
          this.queryPageName = "Company popup message";
          break;
        case "candidate-chat-popup-message":
          this.queryPageName = "Candidate chat popup message";
          break;
        case "company-chat-popup-message":
          this.queryPageName = "Company chat popup message";
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
  }

}
