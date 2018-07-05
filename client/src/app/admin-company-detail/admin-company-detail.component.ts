import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-company-detail',
  templateUrl: './admin-company-detail.component.html',
  styleUrls: ['./admin-company-detail.component.css']
})
export class AdminCompanyDetailComponent implements OnInit {

    user_id;
    currentUser: User;
    info;
    credentials: any = {};
    approve;
    verify;
    is_approved;
    error;
    
  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router) 
  {
    this.route.queryParams.subscribe(params => {
        this.user_id = params['user'];
        console.log(this.user_id);     
    });
  }

  ngOnInit() 
  {
       console.log(this.user_id);

      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      //console.log('ftn')
      //console.log(this.user_id)
      this.credentials.user_id = this.user_id;

      
      if(this.user_id && this.currentUser.is_admin == 1 )
      {
          this.authenticationService.getCompanyById(this.user_id)
            .subscribe(
            data => {
                if(data.error)
                {
                    this.error = "Something Went Wrong";
                }
                else
                {
                    this.info = data;
                    this.approve = data[0]._creator.is_approved;
                    this.verify =data[0]._creator.is_verify;
                    console.log(this.verify);
                    if(this.approve === 1)
                    {
                        this.is_approved = "Aprroved";
                    }
                
                    else
                    {
                        this.is_approved = "";
                    }
                }

            });          
      }
      else
      {
          this.router.navigate(['/not_found']);
          
      }      
  }

}
