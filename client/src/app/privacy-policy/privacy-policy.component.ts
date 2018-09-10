import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

    page_title;
    editor_content;
    page_name;
	constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private titleService: Title,private newMeta: Meta) { 
		this.titleService.setTitle('Work on Blockchain | Privacy Notice');
	}
  ngOnInit() {
	  this.newMeta.updateTag({ name: 'description', content: 'Privacy notice for how we use your data and your rights with your data on the workonblockchain.com blockchain recruitment platform for developers.' });
	  this.newMeta.updateTag({ name: 'keywords', content: 'privacy notice workonblockchain.com' });
	 
      this.page_name = 'Privacy Policy';
      
      this.authenticationService.get_page_content(this.page_name)
            .subscribe(
                data => {
                   if(data)
                   {
               
                      this.page_title= data[0].page_title;
                       this.editor_content = data[0].page_content;
                    
                       
                   }
                    
                   
                 });
      
  }

}
