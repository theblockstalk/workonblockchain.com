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
