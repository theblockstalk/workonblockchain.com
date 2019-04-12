import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'L0-autosugguest-value',
  templateUrl: './autosugguest-value.component.html',
  styleUrls: ['./autosugguest-value.component.css']
})
export class AutosugguestValueComponent implements OnInit {
  @Input() selectedLocations;
  @Output() updatedSelectedLocations: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() { }

  updateCitiesOptions(e) {
    let objIndex = this.selectedLocations.findIndex((obj => obj.name === e.target.value));
    this.selectedLocations[objIndex].visa_needed = e.target.checked;
    this.updatedSelectedLocations.emit(this.selectedLocations);
  }

  deleteLocationRow(i) {
    this.selectedLocations.splice(i, 1);
    this.updatedSelectedLocations.emit(this.selectedLocations);
  }

}
