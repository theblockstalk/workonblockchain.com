import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { unCheckCheckboxes } from '../../../../services/object';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @Input() roles;
  @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
  options = constants.workRoles;
  selectedRole= [];
  errMsg;
  constructor() { }

  ngOnInit() {
    console.log("roless");
    console.log(this.roles);
    this.selectedRole = this.roles;
    this.options = unCheckCheckboxes(this.options);
  }

  selfValidate() {
    if(this.selectedRole && this.selectedRole.length <= 0) {
      this.errMsg = "Please select atleast one role";
      return false;
    }
    this.selectedItems.emit(this.selectedRole);
    delete this.errMsg;
    return true;
  }

}
