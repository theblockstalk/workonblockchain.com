import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {LocationsComponent} from '../locations/locations.component';
import { RoleComponent} from '../role/role.component';
import { Volunteer } from '../../../../constants/interface';

@Component({
  selector: 'app-i-forme-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit {
  @Input() volunteer: object;
  @Input() errorMsg: string;
  @ViewChild(LocationsComponent) location: LocationsComponent;
  @ViewChild(RoleComponent) role: RoleComponent;
  errMsg;
  max_hours= [];
  constructor() { }

  ngOnInit() {
    this.max_hours[0] = -1;
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }
  }

  selfValidate() {
    const locationValid = this.location.selfValidate();
    const roleValid = this.role.selfValidate();
    const objectValid = this.objectiveValidation();
    if(locationValid && roleValid && objectValid) {
      if(this.volunteer['max_hours_per_week'] === '-1') {
        delete this.volunteer['max_hours_per_week'];
      }
      else this.volunteer['max_hours_per_week'] = parseInt(this.volunteer['max_hours_per_week']);
      return true;
    }
    else return false;
  }

  objectiveValidation() {
    if(!this.volunteer['learning_objectives']) {
      this.errMsg = "Please enter learning objective";
      return false;
    }
    delete this.errMsg;
    return true;
  }

}
