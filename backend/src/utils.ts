const PRECISION = 1000;

export function getPrecisedData(val: string) {
  let parsedinteger = parseFloat(val);
  parsedinteger *= PRECISION;
  return parseInt(parsedinteger.toString());
}

export function getRealValue(val: number) {
  return val / PRECISION;
}
