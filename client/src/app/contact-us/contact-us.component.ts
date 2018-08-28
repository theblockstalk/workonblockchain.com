import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  constructor(private titleService: Title,private newMeta: Meta){ 
	this.titleService.setTitle('Work on Blockchain | Contact us');
  }

  ngOnInit() {
	  this.newMeta.addTags([
			{ name: 'description', content: 'Contact the friendly Work on Blockchain team :)' },
			{ name: 'keywords', content: 'contact' }
		]);
  }

}
