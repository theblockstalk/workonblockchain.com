import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-company-detail',
  templateUrl: './admin-company-detail.component.html',
  styleUrls: ['./admin-company-detail.component.css']
})
export class AdminCompanyDetailComponent implements OnInit {

  user_id;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
      this.router.navigate(['/admins/company/' + this.user_id]);
    });
  }

  ngOnInit()
  {}

}
