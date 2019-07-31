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


export const priorityMilestonReached = function(candidate){
  if (!twoDayMilestonReached(candidate)) return false;

  if(candidate.blockchain) {
    let blockchain = candidate.blockchain;
    if (blockchain.commercial_platforms && blockchain.commercial_platforms.length > 0 && blockchain.description_commercial_platforms.length < 100) return false;
    if (blockchain.experimented_platforms && blockchain.experimented_platforms.length > 0 && blockchain.description_experimented_platforms.length < 100) return false;
    if (blockchain.commercial_skills && blockchain.commercial_skills.length > 0 && blockchain.description_commercial_skills.length < 100) return false;
  }

  if (!candidate.image) return false;

  return true;
}

export const twoDayMilestonReached = function(candidate){
  let linking_accounts = 0;
  if (candidate.github_account) linking_accounts++;
  if (candidate.stackexchange_account) linking_accounts++;
  if (candidate.linkedin_account) linking_accounts++;
  if (candidate.medium_account) linking_accounts++;
  if (candidate.stackoverflow_url) linking_accounts++;
  if (candidate.personal_website_url) linking_accounts++;

  if (linking_accounts < 2) return false;

  if(candidate.work_history) {
    for (let work_item of candidate.work_history) {
      if (work_item.description.length < 100) return false;
    }
  }

  return true;
}

export const setBadge = function(text, classColour){
  let candBadge : any = {};
  candBadge.candidate_badge = text;
  candBadge.candidate_badge_color = classColour;
  return candBadge;
}

export const candidateBadge = function(candidate){
  let latest_status = candidate.latest_status.status;
  let candBadge : any = {};

  if (latest_status === 'wizard completed' || latest_status === 'updated' || latest_status === 'reviewed') {
    let twoDaysAgo = new Date();
    let fourDaysAgo = new Date();
    twoDaysAgo.setSeconds(twoDaysAgo.getSeconds() - 172800);
    fourDaysAgo.setSeconds(fourDaysAgo.getSeconds() - 345600);
    let last_status_date = new Date(candidate.latest_status.timestamp);

    if (latest_status === 'reviewed') {
      for (let item of candidate.history) {
        if (item.status.status === 'wizard completed' || item.status.status === 'updated') {
          last_status_date = item.timestamp;
          break;
        }
      }
    }

    let priorityReached = priorityMilestonReached(candidate);
    let twoDayReached = twoDayMilestonReached(candidate);
    if (priorityReached ||
      (twoDayReached && last_status_date < twoDaysAgo) ||
      last_status_date < fourDaysAgo ) {
      candBadge = setBadge('Priority', 'danger');
    } else if (twoDayReached ||
      last_status_date < twoDaysAgo) {
      candBadge = setBadge('2 days till review', 'warning');
    } else {
      candBadge = setBadge('4 days till review', 'info');
    }
  } else {
    latest_status = latest_status.charAt(0).toUpperCase()+''+latest_status.slice(1);
    candBadge = setBadge(latest_status, 'info');
  }
  return candBadge;
}
