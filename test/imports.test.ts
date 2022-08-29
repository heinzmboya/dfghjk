import { describe, expect, test } from 'vitest'

describe('import JackPot component', () => {
  test('normal imports as expected', async () => {
    const cmp = await import('../components/JackPot.vue')
    expect(cmp).toBeDefined()
  })

  test('template string imports as expected', async () => {
    // eslint-disable-next-line @typescript-eslint/quotes
    const cmp = await import(`../components/JackPot.vue`)
    expect(cmp).toBeDefined()
  })

  test('dynamic imports as expected', async () => {
    const name = 'JackPot'
    const cmp = await import(`../components/${name}.vue`)
    expect(cmp).toBeDefined()
  })
})
