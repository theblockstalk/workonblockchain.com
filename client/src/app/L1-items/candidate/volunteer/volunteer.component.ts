import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { UserService} from '../../../user.service';
import {filter_array, unCheckCheckboxes, removeDuplication} from '../../../../services/object';
import {constants} from '../../../../constants/constants';
import {LocationsComponent} from '../locations/locations.component';
import { RoleComponent} from '../role/role.component';

@Component({
  selector: 'app-i-forme-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit {
  @Input() volunteer: object;
  @ViewChild(LocationsComponent) location: LocationsComponent;
  @ViewChild(RoleComponent) role: RoleComponent;
  errMsg;
  max_hours= [];
  constructor() { }

  ngOnInit() {
    for(let i =5; i<=60; i=i+5) {
      this.max_hours.push(i);
    }
  }

  selfValidate() {
    const locationValid = this.location.selfValidate();
    const roleValid = this.role.selfValidate();
    const objectValid = this.objectiveValidation();
    if(locationValid && roleValid && objectValid) return true;
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
