import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent implements OnInit {
  language;commercially_worked=[];commercial_expYear=[];referringData;value;selectedValue;
  constructor() { }
    
  language_opt=
    [
      {name:'Java', value:'Java', checked:false},{name:'C', value:'C', checked:false},
      {name:'C++', value:'C++', checked:false},{name:'C#', value:'C#', checked:false},
      {name:'Python', value:'Python', checked:false},{name:'Visual Basic .NET', value:'Visual Basic .NET', checked:false},
      {name:'PHP', value:'PHP', checked:false},{name:'JavaScript', value:'JavaScript', checked:false},
      {name:'Delphi/Object Pascal', value:'Delphi/Object Pascal', checked:false},{name:'Swift', value:'Swift', checked:false},
      {name:'Perl', value:'Perl', checked:false},{name:'Ruby', value:'Ruby', checked:false},
      {name:'Assembly language', value:'Assembly language', checked:false},{name:'R', value:'R', checked:false},
      {name:'Visual Basic', value:'Visual Basic', checked:false},{name:'Objective-C', value:'Objective-C', checked:false},
      {name:'Go', value:'Go', checked:false},{name:'MATLAB', value:'MATLAB', checked:false},
      {name:'PL/SQL', value:'PL/SQL', checked:false},{name:'Scratch', value:'Scratch', checked:false},
      {name:'Solidity', value:'Solidity', checked:false},{name:'Serpent', value:'Serpent', checked:false},
      {name:'LLL', value:'LLL', checked:false},{name:'Nodejs', value:'Nodejs', checked:false},
      {name:'Scala', value:'Scala', checked:false},{name:'Rust', value:'Rust', checked:false},
      {name:'Kotlin', value:'Kotlin', checked:false},{name:'Haskell', value:'Haskell', checked:false},

    ]
    
    
    commercially=
  [ 
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
    {name:'Steem', value:'Steem', checked:false},
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
    
  ]
    
     exp_year=
  [
    {name:'0-1', value:'0-1', checked:false},
    {name:'1-2', value:'1-2', checked:false},
    {name:'2-4', value:'2-4', checked:false},
    {name:'4-6', value:'4-6', checked:false},
    {name:'6+', value:'6+', checked:false}
  ]


  ngOnInit() {
  }

    onLanguageSearch(e)
    {
        console.log(e.target.value);    
    }
    
    oncommerciallyOptions(obj)
   {
    
   let updateItem = this.commercially_worked.find(this.findIndexToUpdate, obj.value);
      let index = this.commercially_worked.indexOf(updateItem);
      if(index > -1)
      {
        this.commercially_worked.splice(index, 1);
          let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'platform_name',  obj.value);
       //console.log(updateItem);
      let index2 = this.commercial_expYear.indexOf(updateItem2);

      if(index2 > -1)
      {
          
        this.commercial_expYear.splice(index2, 1);
          }
      }
      else
      {
        obj.checked =true;
        this.commercially_worked.push(obj);
      }

      
   }
    
    findIndexToUpdate(obj) 
    { 
        return obj.value === this;
    }
    
     findObjectByKey(array, key, value) 
    {
      // console.log(array.length);
        for (var i = 0; i < array.length; i++) 
        {
        // console.log(array[i][key]);
            if (array[i][key] === value) 
            {
                // console.log( array[i]);
                return array[i];
            }
       
          }
        return null;
    }
    
     onComExpYearOptions(e, value)
   {
      this.selectedValue = e.target.value;
      /*this.value=value;
     this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData); */
     
        let updateItem = this.findObjectByKey(this.commercial_expYear, 'platform_name', value);
       //console.log(updateItem);
      let index = this.commercial_expYear.indexOf(updateItem);

      if(index > -1)
      {
          
        this.commercial_expYear.splice(index, 1);
        this.value=value;
        this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData);
        //console.log(this.LangexpYear); 
        
      }
      else
      {   
      //console.log("not exists");
        this.value=value;
       this.referringData = { platform_name :this.value, exp_year: e.target.value}; 
      this.commercial_expYear.push(this.referringData);
        //console.log(this.LangexpYear); 
        
      }
       
   }



}
