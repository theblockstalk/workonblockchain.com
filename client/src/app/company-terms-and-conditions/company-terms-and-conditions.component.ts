import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-company-terms-and-conditions',
  templateUrl: './company-terms-and-conditions.component.html',
  styleUrls: ['./company-terms-and-conditions.component.css']
})
export class CompanyTermsAndConditionsComponent implements OnInit {
    page_title;
    editor_content;
    page_name;
    company_page_title;
    company_editor_content;

 constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService)  
 { }

  ngOnInit() {
      
      this.authenticationService.get_page_content('Terms and Condition for company')
            .subscribe(
                data => {
                   if(data)
                   {
                       //console.log(data);
                      this.company_page_title= data[0].page_title;
                       this.company_editor_content = data[0].page_content;
                       //console.log(this.editor_content);
                       
                   }
                 });
  }

}
