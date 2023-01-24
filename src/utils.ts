export function isObject(val: unknown): val is Object {
  return Object.prototype.toString.call(val).slice(8, -1) === 'Object'
}

export function isArray(val: unknown): val is Array<any> {
  return Array.isArray(val)
}
