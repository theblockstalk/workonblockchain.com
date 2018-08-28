import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
    page_title;
    editor_content;
    page_name;
	constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private titleService: Title,private newMeta: Meta) { 
		this.titleService.setTitle('Work on Blockchain | FAQ Frequently asked questions');
	}
  ngOnInit() {
	  this.newMeta.addTags([
			{ name: 'description', content: 'Frequently asked questions for the workonblockchain.com blockchain recruitment hiring platform for blockchain developers, software developers and technical professionals.' },
			{ name: 'keywords', content: 'frequently asked questions workonblockchain.com' }
		]);
      this.page_name = 'FAQ';
      
      this.authenticationService.get_page_content(this.page_name)
            .subscribe(
                data => {
                   if(data)
                   {
                       //console.log(data);
                      this.page_title= data[0].page_title;
                       this.editor_content = data[0].page_content;
                       //console.log(this.editor_content);
                       
                   }
                 });
      
  }

}
