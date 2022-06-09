export const formatFloat = (value) => {
  if(!value) value = 0
  return parseFloat(value.replace(",", "."))
}