import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {

  constructor(private router: Router, private titleService: Title,private newMeta: Meta){
	  this.titleService.setTitle('Work on Blockchain | Fees for companies');
  }

  ngOnInit() {
	  this.newMeta.updateTag({ name: 'description', content: 'Fees for hiring companies that use the workonblockchain.com blockchain recruitment platform to hire developers and technical professionals.' });
	  this.newMeta.updateTag({ name: 'keywords', content: 'fees workonblockchain.com' });
    this.router.navigate(['/price_plan']);
  }

}
