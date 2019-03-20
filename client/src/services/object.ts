export const getNameFromValue = function (enumArray, value) {
  const filtered = enumArray.filter( (item) => item.value === value )
  return filtered[0]
}

export const getFilteredNames = function (candidateData, new_roles) {
  let filtered_array = [];
  for(let j=0;j<candidateData.candidate.roles.length;j++){
    const filteredArray = getNameFromValue(new_roles,candidateData.candidate.roles[j]);
    filtered_array.push(filteredArray.name);
  }
  filtered_array.sort();
  return filtered_array;
}


export const changeLocationDisplayFormat = function(locationArray) {
  let selectedValueArray = [];
  let countries;
  let visaRequiredArray = [];
  let noVisaArray = [];
  console.log(locationArray);
  if(locationArray && locationArray.length > 0)
  {
    let citiesArray = [];
    let countriesArray = [];
    for (let country1 of locationArray)
    {
      let locObject : any = {}
      if (country1['remote'] === true) {
        selectedValueArray.push({name: 'Remote' , visa_needed : false});
      }

      if (country1['country']) {
        locObject.name = country1['country'];
        locObject.type = 'country';
        if(country1['visa_needed'] === true) locObject.visa_needed = true;
        else locObject.visa_needed = false;
        countriesArray.push(locObject);
        countriesArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
      }
      if (country1['city']) {
        let city = country1['city'].city + ", " + country1['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        if(country1['visa_needed'] === true) locObject.visa_needed = true;
        else locObject.visa_needed = false;
        citiesArray.push(locObject);
        citiesArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });

      }

    }

    countries = citiesArray.concat(countriesArray);
    countries = countries.concat(selectedValueArray);
    if(countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = countries.find((obj => obj.name === 'Remote'));
      countries.splice(0, 0, remoteValue);
      countries = this.filter_array(countries);

    }

    if(countries && countries.length > 0) {

      for(let loc of countries) {
        if(loc.visa_needed === true)
          visaRequiredArray.push(loc);
        if(loc.visa_needed === false)
          noVisaArray.push(loc);
      }

    }

  }

  return {visaRequiredArray: visaRequiredArray , noVisaArray: noVisaArray };

}
