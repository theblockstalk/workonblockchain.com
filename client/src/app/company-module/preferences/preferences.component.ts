import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  constructor() { }
  locations = [
      {country_code:'000' , name:'Remote', value:'remote', checked:false},
      {country_code:'001' ,name:'Paris', value:'Paris', checked:false},
      {country_code:'001' ,name:'London', value:'London', checked:false},
      {country_code: '001' ,name:'Dublin', value:'Dublin', checked:false},
      {country_code: '001' ,name:'Amsterdam', value:'Amsterdam', checked:false},
      {country_code: '001' ,name:'Berlin', value:'Berlin', checked:false},
      {country_code: '001' ,name:'Barcelona', value:'Barcelona', checked:false},
      {country_code: '002' ,name:'Munich', value:'Munich', checked:false},
      {country_code: '002' ,name:'San Francisco', value:'San Francisco', checked:false},
      {country_code: '002' ,name:'New York', value:'New York', checked:false},
      {country_code: '002' ,name:'Los Angeles', value:'Los Angeles', checked:false},
      {country_code: '002' ,name:'Boston', value:'Boston', checked:false},
      {country_code: '003' ,name:'Chicago', value:'Chicago', checked:false},
      {country_code: '004' ,name:'Austin', value:'Austin', checked:false},
      {country_code: '004' ,name:'Zug', value:'Zug', checked:false},
      {country_code: '004' ,name:'Zurich', value:'Zurich', checked:false},
      {country_code: '004' ,name:'Edinburgh', value:'Edinburgh', checked:false},
      {country_code: '004' ,name:'Copenhagen', value:'Copenhagen', checked:false},
      {country_code: '004' ,name:'Stockholm', value:'Stockholm', checked:false},
      {country_code: '004' ,name:'Madrid', value:'Madrid', checked:false},
      {country_code: '004' ,name:'Toronto', value:'Toronto', checked:false},
      {country_code: '004' ,name:'Sydney', value:'Sydney', checked:false},

  ]

  job_types = ['Full time' , 'Part time' , 'Freelance' ]

  roles = [
      {name:'Backend Developer', value:'Backend Developer', checked:false},
      {name:'Frontend Developer', value:'Frontend Developer', checked:false},
      {name:'UI Developer', value:'UI Developer', checked:false},
      {name:'UX Designer', value:'UX Designer', checked:false},
      {name:'Fullstack Developer', value:'Fullstack Developer', checked:false},
      {name:'Blockchain Developer', value:'Blockchain Developer', checked:false},
      {name:'Smart Contract Developer', value:'Smart Contract Developer', checked:false},
      {name:'Architect', value:'Architect', checked:false},
      {name:'DevOps', value:'DevOps', checked:false},
      {name:'Software Tester', value:'Software Tester', checked:false},
      {name:'CTO', value:'CTO', checked:false},
      {name:'Technical Lead', value:'Technical Lead', checked:false},
      {name:'Product Manager', value:'Product Manager', checked:false},
      {name:'Intern Developer', value:'Intern Developer', checked:false},
      {name:'Researcher', value:'Researcher ', checked:false},
      {name:'Mobile app developer', value:'Mobile app developer', checked:false},
      {name:'Data scientist', value:'Data scientist', checked:false},
      {name:'Security specialist ', value:'Security specialist', checked:false},
  ]

  currency = [
      "£ GBP" ,"€ EUR" , "$ USD"
  ]

  availability= ["Now","1 month","2 months","3 months","Longer than 3 months"]

  blockchain = [
    {name:'Bitcoin', value:'Bitcoin', checked:false},
    {name:'Ethereum', value:'Ethereum', checked:false},
    {name:'Ripple', value:'Ripple', checked:false},
    {name:'Stellar', value:'Stellar', checked:false},
    {name:'Hyperledger Fabric', value:'Hyperledger Fabric', checked:false},
    {name:'Hyperledger Sawtooth', value:'Hyperledger Sawtooth', checked:false},
    {name:'Quorum', value:'Quorum', checked:false},
    {name:'Corda', value:'Corda', checked:false},
    {name:'EOS', value:'EOS', checked:false},
    {name:'NEO', value:'NEO', checked:false},
    {name:'Waves', value:'Waves', checked:false},
    {name:'Steemit', value:'Steemit', checked:false},
    {name:'Lisk', value:'Lisk', checked:false},
    {name:'Quantum', value:'Quantum', checked:false},
    {name:'Tezos', value:'Tezos', checked:false},
    {name:'Cardano', value:'Cardano', checked:false},
    {name:'Litecoin', value:'Litecoin', checked:false},
    {name:'Monero', value:'Monero', checked:false},
    {name:'ZCash', value:'ZCash', checked:false},
    {name:'IOTA', value:'IOTA', checked:false},
    {name:'NEM', value:'NEM', checked:false},
    {name:'NXT', value:'NXT', checked:false},
    {name:'Dash', value:'Dash', checked:false},
    {name:'Doge', value:'Doge', checked:false},
  ]

  language_opt= [
    {name:'Java', value:'Java', checked:false},
    {name:'C', value:'C', checked:false},
    {name:'C++', value:'C++', checked:false},
    {name:'C#', value:'C#', checked:false},
    {name:'Python', value:'Python', checked:false},
    {name:'Visual Basic .NET', value:'Visual Basic .NET', checked:false},
    {name:'PHP', value:'PHP', checked:false},
    {name:'JavaScript', value:'JavaScript', checked:false},
    {name:'Delphi/Object Pascal', value:'Delphi/Object Pascal', checked:false},
    {name:'Swift', value:'Swift', checked:false},
    {name:'Perl', value:'Perl', checked:false},
    {name:'Ruby', value:'Ruby', checked:false},
    {name:'Assembly language', value:'Assembly language', checked:false},
    {name:'R', value:'R', checked:false},
    {name:'Visual Basic', value:'Visual Basic', checked:false},
    {name:'Objective-C', value:'Objective-C', checked:false},
    {name:'Go', value:'Go', checked:false},
    {name:'MATLAB', value:'MATLAB', checked:false},
    {name:'PL/SQL', value:'PL/SQL', checked:false},
    {name:'Scratch', value:'Scratch', checked:false},
    {name:'Solidity', value:'Solidity', checked:false},
    {name:'Serpent', value:'Serpent', checked:false},
    {name:'LLL', value:'LLL', checked:false},
    {name:'Nodejs', value:'Nodejs', checked:false},
    {name:'Scala', value:'Scala', checked:false},
    {name:'Rust', value:'Rust', checked:false},
    {name:'Kotlin', value:'Kotlin', checked:false},
    {name:'Haskell', value:'Haskell', checked:false},

    ]



  ngOnInit() {
  }

}
