export const formatCurrency = (value) => {
  if(!value) value = 0
  return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}