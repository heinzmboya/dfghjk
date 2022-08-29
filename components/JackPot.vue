<script setup lang="ts">
let sessionCredit = $ref(0)
let userAccount = $ref(0)
let isLetter1Spinnning = $ref(false)
let isLetter2Spinnning = $ref(false)
let isLetter3Spinnning = $ref(false)

const col1 = ref<HTMLElement | null>(null)
const col2 = ref<HTMLElement | null>(null)
const col3 = ref<HTMLElement | null>(null)

const signs = ref(['C', 'L', 'O'])

const removeSpin = (element: HTMLElement | null, time, spinState) => {
  setTimeout(() => {
    element?.classList.remove('animate-spin')
    spinState()
  }, time)
}

const startRolling = async () => {
  let data
  if (isLetter1Spinnning) {
    data = await $fetch('/api/jackpot', {
      method: 'post',
      body: { spin: true },
    })
    signs.value = data.letters

    removeSpin(col1.value, 1000, async () => {
      isLetter1Spinnning = false
    })
    removeSpin(col2.value, 2000, () => isLetter2Spinnning = false)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    removeSpin(col3.value, 3000, () => { isLetter3Spinnning = false; setCredit(data.credits) })
    return
  }

  isLetter1Spinnning = true
  isLetter2Spinnning = true
  isLetter3Spinnning = true

  col1.value?.classList.add('animate-spin')
  col2.value?.classList.add('animate-spin')
  col3.value?.classList.add('animate-spin')

  setTimeout(() => {
    startRolling()
  }, 0)
}

const setCredit = (credits) => {
  sessionCredit = credits
}

const randomDirection = () => {
  const random = Math.random()
  if (random > 0.5)
    return // 50% chance it moves

  const plusOrMinus = Math.random() < 0.5 ? -1 : 1
  const btn: any = document.querySelector('.random')

  const rect = btn.getBoundingClientRect() // current position

  // const height = document.documentElement.clientHeight
  const width = document.documentElement.clientWidth

  let newPosition = (rect.left + (plusOrMinus * 300))
  if (newPosition > width)
    newPosition = width - 300

  if (newPosition < 0)
    newPosition = 300

  // btn.style.transform = `translate(${newPosition}px)`

  btn.style.left = `${newPosition}px`
}

async function cashOut() {
  const random = Math.random()
  if (random < 0.4)
    return // 40% chance it doesnt click

  const data = await $fetch<{ account: number; credits: number }>('/api/jackpot', {
    method: 'post',
    body: { cashOut: true },
  })
  userAccount = data.account
  sessionCredit = data.credits
}

async function sessionStartCredits(state = false) {
  const data = await $fetch<{ credits: number }>('/api/jackpot', {
    method: 'post',
    body: { newSession: state },
  })
  sessionCredit = data.credits
}

sessionStartCredits()
</script>

<template>
  <div>
    <div mx-auto w-md space-y-5>
      <div> Account: {{ userAccount }}</div>
      <div> Session Credit: {{ sessionCredit }}</div>
      <div v-if="signs.length" bg-gray-100 p-5>
        <client-only>
          <table class="w-md  rounded">
            <tr>
              <td ref="col1" text-5xl font-bold class="w-1/3">
                {{ isLetter1Spinnning ? 'X' : signs[0] }}
              </td>
              <td ref="col2" text-5xl font-bold class="w-1/3">
                {{ isLetter2Spinnning ? 'X' : signs[1] }}
              </td>
              <td ref="col3" text-5xl font-bold class="w-1/3">
                {{ isLetter3Spinnning ? 'X' : signs[2] }}
              </td>
            </tr>
          </table>
        </client-only>
      </div>

      <div m-5 space-x-10>
        <button
          v-if="sessionCredit" bg-gray-100 rounded px-2 py-1 hover-bg-gray-200
          @click="isLetter3Spinnning ? null : startRolling()"
        >
          {{ isLetter3Spinnning ? 'Spinning...' : 'Roll slots' }}
        </button>

        <button v-else bg-gray-100 rounded px-2 py-1 hover-bg-gray-200 @click="sessionStartCredits(true)">
          New Session
        </button>

        <button
          class="random" z-10 bg-gray-200 font-bold px-2 py-1 rounded absolute @click="cashOut"
          @mouseover="randomDirection"
        >
          CASH OUT
        </button>
      </div>
    </div>
  </div>
</template>

