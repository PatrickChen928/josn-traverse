import { describe, expect, it } from 'vitest'
import { traverser } from '../src'
import data from '../../data.json'

describe('traverser', () => {
  it('traverser', () => {
    const begin = Date.now()
    data.forEach((d) => {
      traverser(d, [
        {
          exit: {
            condition: (node) => {
              return node.type === 'string' && /^[^a-zA-Z0-9\u4E00-\u9FA5]+$/.test(node.value)
            },
            handle: (node, parent) => {
              parent.value[node.key] = null
            },
          },
        },
        {
          enter: {
            condition: (node) => {
              return node.type === 'string' && (node.value.includes('（') || node.value.includes('）'))
            },
            handle: (node, parent) => {
              parent.value[node.key] = node.value.replaceAll('（', '(').replaceAll('）', ')')
            },
          },
        },
        {
          enter: {
            condition: (node) => {
              return node.type === 'string'
            },
            handle: (node, parent) => {
              parent.value[node.key] = node.value.trim()
            },
          },
        },
      ])
    })
    // eslint-disable-next-line no-console
    console.log('Time: ', (Date.now() - begin) / 1000)

    // eslint-disable-next-line no-console
    // console.log(data, '======')
    expect(data[5]['ods_lget_new_vet_drug_incr_dt.reg_no']).toEqual('(2022)新兽药证字65号')
  })
})
