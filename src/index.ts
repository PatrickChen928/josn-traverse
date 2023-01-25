import { isArray, isObject } from './utils'

type DataType = 'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'array'
interface Node {
  key: string
  value: any
  type: DataType
  index?: number
}

interface Parent extends Node {
  __parent: Parent | null
}

interface Visitor {
  enter?: {
    condition?: (node: Node, parent: Parent) => boolean
    handle: (node: Node, parent: Parent) => void
  }
  exit?: {
    condition?: (node: Node, parent: Parent) => boolean
    handle: (node: Node, parent: Parent) => void
  }
}

function handleVisitors(visitors: Visitor[], type: 'enter' | 'exit', json: Record<string, any>, node: Node, parent: Parent) {
  visitors.forEach((visitor) => {
    const target = visitor[type]
    if (target) {
      const { condition, handle } = target
      const newNode = { ...node, value: json[node.key] }
      if (!condition || condition(newNode, parent))
        handle(newNode, parent)
    }
  })
}

export function traverser(json: Record<string, any>, visitors: Visitor[], __parent?: Parent) {
  if (!__parent) {
    __parent = {
      value: json,
      key: '',
      type: 'object',
      __parent: null,
    }
  }
  for (const key in json) {
    const value = json[key]
    let type = typeof value as DataType
    if (isObject(value)) {
      const parent: Parent = {
        key,
        value,
        type,
        __parent,
      }
      handleVisitors(visitors, 'enter', json, { type, key, value }, __parent)
      traverser(value, visitors, parent)
    }
    else if (isArray(value)) {
      type = 'array'
      handleVisitors(visitors, 'enter', json, { type, key, value }, __parent)
      const parent: Parent = {
        key,
        value,
        type,
        __parent,
      }
      value.forEach((item, index) => {
        traverser(item, visitors, { ...parent, index })
      })
    }
    else {
      handleVisitors(visitors, 'enter', json, { type, key, value }, __parent)
    }

    const valueNew = json[key]
    const typeNew = typeof value as DataType
    handleVisitors(visitors, 'exit', json, { type: typeNew, key, value: valueNew }, __parent)
  }
}
