import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {
  user_id;

  constructor(private route: ActivatedRoute, private router: Router) {

    this.router.navigate(['users/talent']);
  }

  ngOnInit(){}
}
