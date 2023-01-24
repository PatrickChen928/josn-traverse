import { describe, expect, it } from 'vitest'
import { traverser } from '../src'

describe('traverser', () => {
  it('traverser', () => {
    const json = {
      a: 1,
      b: {
        c: '（（））',
      },
    }
    traverser(json, [
      {
        enter: {
          condition: (node) => {
            return node.key === 'a'
          },
          handle: (node, parent) => {
            parent.value.a = 2
          },
        },
      },
      {
        enter: {
          condition: (node) => {
            return node.type === 'string' && (node.value.includes('（') || node.value.includes('）'))
          },
          handle: (node, parent) => {
            parent.value[node.key] = parent.value[node.key].replace(/（/g, '(').replace(/）/g, ')')
          },
        },
      },
    ])
    // eslint-disable-next-line no-console
    console.log(json, '======')
    expect(json.a).toEqual(2)
  })
})
