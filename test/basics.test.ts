import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'

describe('import JackPot component', async () => {
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

describe('import GameTable component', async () => {
  test('dynamic imports as expected', async () => {
    const name = 'GameTable'
    const cmp = await import(`../components/${name}.vue`)
    expect(cmp).toBeDefined()
  })
})

describe('import CashoutButton component', async () => {
  test('dynamic imports as expected', async () => {
    const name = 'CashoutButton'
    const cmp = await import(`../components/${name}.vue`)
    expect(cmp).toBeDefined()
  })
})

describe('Server api', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('..', import.meta.url)),
    server: true,
  })

  test('Data received back contains letters and credits value after a spin', async () => {
    const data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })

    expect(data).toHaveProperty('letters')
    expect(data).toHaveProperty('credits')
  })

  test('Number of letters received back is 3', async () => {
    const data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })

    // expect(data.letters.join('')).toMatch(/\b[A-Z]{3}\b/)
    expect(data.letters).toHaveLength(3)
  })

  test('If losing roll, credits should be less by 1', async () => {
    const data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })
    const credits = data.credits

    const data2 = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })

    const credits2 = data2.credits; const letters = data2.letters

    if (letters[0] !== letters[1])

      expect(credits - credits2).toBe(1)
  })

  test('If winning roll, credits value should be greater', async () => {
    const data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })
    const credits = data.credits

    const data2 = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })

    const credits2 = data2.credits; const letters = data2.letters

    if (letters[0] === letters[1] && letters[1] === letters[2])

      expect(credits2).toBeGreaterThan(credits)
  })

  test('Initialize 10 credits on game start', async () => {
    const data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { newSession: true },
    })

    expect(data.credits).toBe(10)
  })

  test('Remaining credits after cash-out is 0', async () => {
    const data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { cashOut: true },
    })

    expect(data.credits).toBe(0)
  })
})
