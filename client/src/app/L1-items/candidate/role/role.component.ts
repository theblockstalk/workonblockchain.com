import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { unCheckCheckboxes } from '../../../../services/object';
import {constants} from '../../../../constants/constants';

@Component({
  selector: 'app-i-forme-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @Input() roles: Array<string>;
  @Output() selectedItems: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();
  options = constants.workRoles;
  selectedRole= [];
  errMsg;
  constructor() { }

  ngOnInit() {
    this.options = unCheckCheckboxes(this.options);
  }

  selfValidate() {
    if(!this.roles) {
      this.errMsg = "Please select atleast one role";
      return false;
    }
    if(this.roles && this.roles.length <= 0) {
      this.errMsg = "Please select atleast one role";
      return false;
    }
    this.selectedItems.emit(this.roles);
    delete this.errMsg;
    return true;
  }

}
