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
