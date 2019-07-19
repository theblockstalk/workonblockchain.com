import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-i-forme-edit-link-icon',
  templateUrl: './edit-link-icon.component.html',
  styleUrls: ['./edit-link-icon.component.css']
})
export class EditLinkIconComponent implements OnInit {
  @Input() routerUrl: string;
  @Input() section: string;

  sectionScroll;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  internalRoute(page,dst){
    this.sectionScroll = dst;
    this.router.navigate([page], {fragment: dst});
  }

}
