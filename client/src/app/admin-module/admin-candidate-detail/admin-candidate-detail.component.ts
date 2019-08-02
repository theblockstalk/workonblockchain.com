import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-candidate-detail',
  templateUrl: './admin-candidate-detail.component.html',
  styleUrls: ['./admin-candidate-detail.component.css']
})
export class AdminCandidateDetailComponent implements OnInit {
  user_id;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
    this.router.navigate(['/admins/talent/' + this.user_id]);
  }

  ngOnInit(){}
}
