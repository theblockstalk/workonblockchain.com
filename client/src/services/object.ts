export const makeImgCode = function (object) {
  return '<img class="mb-1 ml-1" src = "/assets/images/all_icons/blockchain/'+object['name']+'.png" alt="'+object['name']+' Logo"> ';
}

export const makeIconCode = function () {
  return '<i class="fas fa-code"></i> ';
}

export const getDateFromDays = function (day) {
  let lastMsgDate = new Date();
  lastMsgDate.setTime(lastMsgDate.getTime() - (day*24*60*60*1000));
  return lastMsgDate;
}

export const copyObject = function (object) {
  return JSON.parse(JSON.stringify(object));
}

export const getNameFromValue = function (enumArray, value) {
  const filtered = enumArray.filter( (item) => item.value === value )
  return filtered[0];
}

export const getFilteredNames = function (userRoles, enumArray) {
  let filtered_array = [];
  for(let role of userRoles){
    const filteredArray = getNameFromValue(enumArray , role);
    filtered_array.push(filteredArray.name);
  }
  filtered_array.sort();
  return filtered_array;
}

export const filter_array = function (arr) {
  var hashTable = {};
  return arr.filter(function (el) {
    var key = JSON.stringify(el);
    var match = Boolean(hashTable[key]);
    return (match ? false : hashTable[key] = true);
  });
}

export const changeLocationDisplayFormat = function(locationArray) {
  let selectedValueArray = [];
  let countries;
  let visaRequiredArray = [];
  let noVisaArray = [];
  if(locationArray && locationArray.length > 0)
  {
    let citiesArray = [];
    let countriesArray = [];
    for (let loc of locationArray)
    {
      let locObject : any = {}
      if (loc['remote'] === true) {
        selectedValueArray.push({name: 'Remote' , visa_needed : false});
      }

      if (loc['country']) {
        locObject.name = loc['country'];
        locObject.type = 'country';
        if(loc['visa_needed'] === true) locObject.visa_needed = true;
        else locObject.visa_needed = false;
        countriesArray.push(locObject);
        countriesArray= sorting(countriesArray);
      }
      if (loc['city']) {
        let city = loc['city'].city + ", " + loc['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        if(loc['visa_needed'] === true) locObject.visa_needed = true;
        else locObject.visa_needed = false;
        citiesArray.push(locObject);
        citiesArray = sorting(citiesArray);

      }

    }

    countries = citiesArray.concat(countriesArray);
    countries = countries.concat(selectedValueArray);
    if(countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = countries.find((obj => obj.name === 'Remote'));
      countries.splice(0, 0, remoteValue);
      countries = removeDuplication(countries);
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

export const changeLocationFormatToBE = function(locationArray) {
  let selectedValueArray = [];
  let countries;
  let visaRequiredArray = [];
  let noVisaArray = [];
  if(locationArray && locationArray.length > 0)
  {
    let citiesArray = [];
    let countriesArray = [];
    for (let loc of locationArray)
    {
      let locObject : any = {}
      if (loc['remote'] === true) {
        selectedValueArray.push({name: 'Remote' , visa_needed : false});
      }

      if (loc['country']) {
        locObject.name = loc['country'];
        locObject.type = 'country';
        if(loc['visa_needed'] === true) locObject.visa_needed = true;
        else locObject.visa_needed = false;
        countriesArray.push(locObject);
        countriesArray= sorting(countriesArray);
      }
      if (loc['city']) {
        let city = loc['city'].city + ", " + loc['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        if(loc['visa_needed'] === true) locObject.visa_needed = true;
        else locObject.visa_needed = false;
        citiesArray.push(locObject);
        citiesArray = sorting(citiesArray);

      }

    }

    countries = citiesArray.concat(countriesArray);
    countries = countries.concat(selectedValueArray);
    if(countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = countries.find((obj => obj.name === 'Remote'));
      countries.splice(0, 0, remoteValue);
      countries = removeDuplication(countries);
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

export const sorting = function (array) {
  return array.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  });
}

export const removeDuplication = function (array) {
  let hashTable = {};

  return array.filter(function (el) {
    const key = JSON.stringify(el);
    const match = Boolean(hashTable[key]);

    return (match ? false : hashTable[key] = true);
  });
}

export const unCheckCheckboxes = function(array) {
  for(let type of array ) {
    type.checked = false;
  }
  return array;
}

export const checkNumber = function(number) {
  return /^[0-9]*$/.test(number);
}

export const createLocationsListStrings = function(locationArray){
  let placesArray = [];

  for (let noVisaPlace of locationArray) {
    if (noVisaPlace.name === 'Remote') {
      let remote = '<i class="fas fa-laptop"></i> ' + noVisaPlace.name;
      placesArray.push(remote);
    }
    if (noVisaPlace.type === 'city') {
      let city = '<i class="fas fa-city"></i> ' + noVisaPlace.name;
      placesArray.push(city);
    }
    if (noVisaPlace.type === 'country') {
      let country = '<i class="fas fa-flag"></i> ' + noVisaPlace.name;
      placesArray.push(country);
    }
  }
  return placesArray;
}
