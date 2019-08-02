import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-update-candidate-profile',
  templateUrl: './admin-update-candidate-profile.component.html',
  styleUrls: ['./admin-update-candidate-profile.component.css']
})
export class AdminUpdateCandidateProfileComponent implements OnInit {
  user_id;

  constructor(private route: ActivatedRoute, private router: Router)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
    this.router.navigate(['/admins/talent/'+this.user_id+'/edit']);
  }

  ngOnInit(){}
}
