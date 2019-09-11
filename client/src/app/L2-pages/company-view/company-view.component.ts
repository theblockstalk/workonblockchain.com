import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';

declare var $: any;

@Component({
  selector: 'app-p-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css']
})
export class CompanyViewComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // admin, company

  companyMsgTitle;companyMsgBody;imgPath;referred_name;
  pricePlanLink = '/pricing';company_name;countries; selectedValueArray = [];

  constructor(private route: ActivatedRoute, private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
    console.log(this.viewBy);
    console.log('in company view page level');
    console.log(this.userDoc);
    if(this.userDoc['company_logo'] != null ) this.imgPath =  this.userDoc['company_logo'];
    if (this.userDoc['name']) this.referred_name = this.userDoc['name'];
    else if(this.userDoc['_creator'].referred_email) this.referred_name = this.userDoc['_creator'].referred_email;

    this.company_name = this.userDoc['first_name'].charAt(0).toUpperCase()+''+this.userDoc['first_name'].slice(1)+' '+this.userDoc['last_name'].charAt(0).toUpperCase()+''+this.userDoc['last_name'].slice(1)
    console.log(this.company_name);

    if(this.viewBy === 'company'){
      this.authenticationService.get_page_content('Company popup message')
      .subscribe(
        data => {
          if(data){
              this.companyMsgTitle = data['page_title'];
              this.companyMsgBody = data['page_content'];
          }
        }
      );
    }
  }

  getLocation(location) {
    this.selectedValueArray = [];
    for (let country1 of location) {
      let locObject : any = {};
      if (country1['remote'] === true) {
        this.selectedValueArray.push({name: 'Remote'});
      }
      if (country1['city']) {
        let city = country1['city'].city + ", " + country1['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        this.selectedValueArray.push(locObject);
      }
    }
    this.countries = this.selectedValueArray;
    this.countries.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    if(this.countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
      this.countries.splice(0, 0, remoteValue);
      this.countries = this.filter_array(this.countries);
    }
    console.log(this.countries);
    return this.countries;
  }

  filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

}
