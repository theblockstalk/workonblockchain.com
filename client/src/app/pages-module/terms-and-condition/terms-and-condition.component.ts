import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.css']
})
export class TermsAndConditionComponent implements OnInit {

    page_title;
    editor_content;
    page_name;
    company_page_title;
    company_editor_content;
    
	constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private titleService: Title,private newMeta: Meta) { 
		this.titleService.setTitle('Work on Blockchain | Candidate terms');
	}
  ngOnInit() {
	  this.newMeta.updateTag({ name: 'description', content: 'Terms for candidates that use the workonblockchain.com blockchain recruitment hiring platform to find employment as blockchain developers and technical people.' });
	  this.newMeta.updateTag({ name: 'keywords', content: 'candidate terms conditions workonblockchain.com' });
      
      this.authenticationService.get_page_content('Terms and Condition for candidate')
            .subscribe(
                data => {
                   if(data)
                   {
                       ////console.log(data);
                      this.page_title= data[0].page_title;
                       this.editor_content = data[0].page_content;
                       ////console.log(this.editor_content);
                       
                   }
                 });
      
      
  }

}
