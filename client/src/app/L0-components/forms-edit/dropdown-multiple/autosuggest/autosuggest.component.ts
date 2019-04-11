import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserService} from '../../../../user.service';
import {filter_array} from '../../../../../services/object'
import { Router } from '@angular/router';

@Component({
  selector: 'L0-autosuggest',
  templateUrl: './autosuggest.component.html',
  styleUrls: ['./autosuggest.component.css']
})
export class AutosuggestComponent implements OnInit {
  @Input() placeholder;
  @Input() controllerOptions;
  @Input() autoSuggestController;
  @Input() resultItemDisplay;
  @Input() selectedValue;
  @Output() selectedItems : EventEmitter<any> = new EventEmitter<any>();
  selectedValueArray = [];
  error;
  textValue;
  optionValues = [];

  constructor(private authenticationService: UserService, private router: Router) { }

  ngOnInit() {
    console.log(this.autoSuggestController);
  }

  autoSuggest() {
    if(this.textValue !== '') {
      this.error = '';
      this.autoSuggestController(this.textValue, this.controllerOptions)
        .subscribe(data => {
            if (data) {
              this.optionValues = this.resultItemDisplay(data);
            }
          },
          error =>
          {
            if(error['message'] === 500 || error['message'] === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
            if(error.message === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
  }

  selectedValueAndData(inputValue) {
    const data = this.selectedValue(inputValue, this.optionValues);
    this.selectedItems.emit(data);
  }

}
