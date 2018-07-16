import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

    page_title;
    editor_content;
    page_name;
  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService) { 
    }
  ngOnInit() {
      this.page_name = 'Privacy Policy';
      
      this.authenticationService.get_page_content(this.page_name)
            .subscribe(
                data => {
                   if(data)
                   {
                       console.log(data);
                      this.page_title= data[0].page_title;
                       this.editor_content = data[0].page_content;
                       console.log(this.editor_content);
                       
                   }
                 });
      
  }

}
