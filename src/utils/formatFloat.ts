export const formatFloat = (value) => {
  console.log('fmfloat', value)
  if(!value) value = "0,0"
  return parseFloat(value.replace(",", "."))
}