export interface ButtonGroupObject {
  label: string;
  exp_year: string;
}

export interface Options {
  name: string;
  value: string;
  checked: boolean;
}

export interface WizardObject {
  name: string;
  routerLink: string;
  disabled: boolean;
  active: boolean;
}

export interface Contractor {
  expected_hourly_rate: number;
  currency: string;
  max_hour_per_week: number;
  location: Array<object>;
  roles: Array<string>;
  contractor_type: Array<string>;
  agency_website: string;
  service_description: string;
}

export interface Employee {
  employment_type: Array<string>;
  expected_annual_salary: number;
  currency: string;
  location: Array<object>;
  roles: Array<string>;
  employment_availability: string;
}

export interface Volunteer {
  location: Array<object>;
  roles: Array<string>;
  max_hours_per_week: number;
  learning_objectives: string;
}

export interface WorkHistory {
  companyname: string;
  positionname: string;
  locationname: string;
  description: string;
  startdate: string;
  enddate: string;
  currentwork: boolean;
}

export interface EducationHistory {
  uniname: string;
  degreename: string;
  fieldname: string;
  eduyear: number;
}
