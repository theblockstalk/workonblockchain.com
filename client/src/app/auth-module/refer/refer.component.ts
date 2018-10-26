import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {
	code = '';
	constructor( private route: ActivatedRoute) {
		this.code = route.snapshot.params['code'];
		//console.log(this.code);
    }
	
	ngOnInit(){
	}
}
