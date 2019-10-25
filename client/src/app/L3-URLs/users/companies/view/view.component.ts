import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../user.service' ;
import {constants} from '../../../../../constants/constants';

@Component({
  selector: 'app-u-users-companies-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  currentUser;userDoc;

  constructor(private authenticationService: UserService,private router: Router) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser) this.router.navigate(['/login']);
    if(this.currentUser && this.currentUser.type === 'company'){
      this.authenticationService.getCurrentCompany(this.currentUser._id, false)
      .subscribe(
        data =>{
          if(!data['terms_id']) this.router.navigate(['/company_wizard']);
          else if(!data['company_founded'] || !data['no_of_employees'] || !data['company_funded'] || !data['company_description'] )
            this.router.navigate(['/about_comp']);
          else if(((new Date(data['_creator'].created_date) > new Date('2018/11/28')) || (!data['job_ids'] || data['job_ids'].length === 0) || !data['when_receive_email_notitfications']))
            this.router.navigate(['/preferences']);
          else if(!data['pricing_plan']) this.router.navigate(['/pricing']);
          else if(constants.eu_countries.indexOf(data['company_country']) === -1) {
            if ((data['canadian_commercial_company'] === true || data['canadian_commercial_company'] === false) || (data['usa_privacy_shield'] === true || data['usa_privacy_shield'] === false) || data['dta_doc_link']) {
              this.userDoc = data;
            }
            else this.router.navigate(['/gdpr-compliance']);
          }
          else this.userDoc = data;
        },
        error => {
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
            console.log(error['error']['message']);
        }
      );
    }
    else this.router.navigate(['/not_found']);
  }

}
