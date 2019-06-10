import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {constants} from '../../../../constants/constants';
import { EducationHistory } from '../../../../constants/interface';

declare var $:any;

@Component({
  selector: 'app-i-forme-education-history',
  templateUrl: './education-history.component.html',
  styleUrls: ['./education-history.component.css']
})
export class EducationHistoryComponent implements OnInit {
  @Input() education_history: EducationHistory[];
  EducationForm: FormGroup;
  eduData;
  years = constants.year;
  uniErrMsg = [];
  degreeErrMsg = [];
  fieldErrMsg = [];
  gradErrMsg = [];
  education_array = [];
  constructor(private _fb: FormBuilder, private datePipe: DatePipe) { }


  ngOnInit() {
    this.EducationForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });

    if(this.education_history && this.education_history.length > 0) {
      this.eduData = this.education_history;
      this.EducationForm = this._fb.group({
        itemRows: this._fb.array(
          this.education_data()
        )
      });
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 100);
    }
  }

  education_data(): FormGroup[]
  {
    return this.eduData
      .map(i => this._fb.group({ uniname: i.uniname , degreename : i.degreename,fieldname:i.fieldname,eduyear:(i.eduyear).toString()} ));
  }

  initItemRows()
  {
    return this._fb.group({
      uniname: [''],
      degreename:[''],
      fieldname:[''],
      eduyear:[]
    });
  }

  addNewRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    control.push(this.initItemRows());
  }

  deleteRow(index: number)
  {

    const control = <FormArray>this.EducationForm.controls['itemRows'];
    control.removeAt(index);
  }

  get DynamicEduFormControls() {
    return <FormArray>this.EducationForm.get('itemRows');
  }

  uniValidate(index) {
    if(!this.EducationForm.value.itemRows[index].uniname) {
      this.uniErrMsg[index] = 'Please fill university';
      return false;
    }
    delete this.uniErrMsg[index];
    return true;
  }

  degreeValidate(index) {
    if(!this.EducationForm.value.itemRows[index].degreename) {
      this.degreeErrMsg[index] = 'Please fill degree';
      return false;
    }
    delete this.degreeErrMsg[index];
    return true;
  }

  fieldValidate(index) {
    if(!this.EducationForm.value.itemRows[index].fieldname) {
      this.fieldErrMsg[index] = 'Please fill field of study';
      return false;
    }
    delete this.fieldErrMsg[index];
    return true;
  }

  graduationValidate(index) {
    const currentTime = new Date();
    const year = currentTime.getFullYear()
    if(!this.EducationForm.value.itemRows[index].eduyear) {
      this.gradErrMsg[index] = 'Please fill graduation year';
      return false;
    }
    if(this.EducationForm.value.itemRows[index].eduyear > year) {
      this.gradErrMsg[index] = 'Year should be in past';
      return false;
    }
    delete this.gradErrMsg[index];
    return true;
  }

  selfValidate() {
    let errorCount = 0;
    this.education_array = []
    if(this.EducationForm.value.itemRows.length > 0 ) {
      for (let key in this.EducationForm.value.itemRows) {
        const uniValid = this.uniValidate(key);
        if(!uniValid) errorCount++;
        const degreeValid = this.degreeValidate(key);
        if(!degreeValid) errorCount++;
        const fieldValid = this.fieldValidate(key);
        if(!fieldValid) errorCount++;
        const gradValid = this.graduationValidate(key);
        if(!gradValid) errorCount++;
        if(errorCount === 0) {
          const educationjson = {uniname : this.EducationForm.value.itemRows[key].uniname , degreename :  this.EducationForm.value.itemRows[key].degreename
            ,fieldname : this.EducationForm.value.itemRows[key].fieldname , eduyear : Number(this.EducationForm.value.itemRows[key].eduyear)  };
          this.education_array.push(educationjson) ;
        }

      }
      if(errorCount === 0) {
        return true;
      }
      else return false;
    }
    return true;
  }

}
