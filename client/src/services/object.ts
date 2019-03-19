export const getNameFromValue = function (enumArray, value) {
  const filtered = enumArray.filter( (item) => item.value === value )
  return filtered[0]
}
