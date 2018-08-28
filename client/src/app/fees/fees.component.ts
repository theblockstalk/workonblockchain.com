import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {

  constructor(private titleService: Title,private newMeta: Meta){ 
	this.titleService.setTitle('Work on Blockchain | Fees for companies');
  }

  ngOnInit() {
	  this.newMeta.addTags([
			{ name: 'description', content: 'Fees for hiring companies that use the workonblockchain.com blockchain recruitment platform to hire developers and technical professionals.' },
			{ name: 'keywords', content: 'fees workonblockchain.com' }
		]);
  }

}
