export interface ControllerOptions {
  countries: boolean;
}
export interface ButtonGroupObject {
  label: string;
  exp_year: string; //'0-1', '1-2', '2-4', '4-6', '6+'
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

export interface Locations {
  city: string;
  country: string;
  remote: boolean;
  visa_needed: boolean;
}

export interface Contractor {
  expected_hourly_rate: number;
  currency: string; //'USD', 'EUR', 'GBP'
  max_hour_per_week: number;
  location: Array<Locations>;
  roles: Array<string>;
  contractor_type: Array<string>; //['agency', 'freelance']
  agency_website: string;
  service_description: string;
}

export interface Employee {
  employment_type: Array<string>; // ['Full time', 'Part time']
  expected_annual_salary: number;
  currency: string; //'USD', 'EUR', 'GBP'
  location: Array<Locations>;
  roles: Array<string>;
  employment_availability: string; //['1 week', '2 weeks', '3 weeks' ,'1 month','Now','2 months','3 months','Longer than 3 months']
}

export interface Volunteer {
  location: Array<Locations>;
  roles: Array<string>;
  max_hours_per_week: number;
  learning_objectives: string;
}

export interface WorkHistory {
  companyname: string;
  positionname: string;
  locationname: string;
  description: string;
  startdate: Date;
  enddate: Date;
  currentwork: boolean;
}

export interface EducationHistory {
  uniname: string;
  degreename: string;
  fieldname: string;
  eduyear: number;
}

export interface CommercialPlatform {
  name: string;
  exp_year: string;
}

export interface CommercialSkill {
  skill: string;
  exp_year: string;
}

export interface Language {
  language: string;
  exp_year: string;
}
