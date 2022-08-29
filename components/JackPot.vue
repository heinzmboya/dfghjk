<script setup lang="ts">
let sessionCredit = $ref(0)
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
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1
  const ball: any = document.querySelector('.random')

  const rect = ball.getBoundingClientRect()

  ball.style.left = `${rect.left + (plusOrMinus * 300)}px`
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
      <div> Session Credit: {{ sessionCredit }}</div>
      <div v-if="signs.length" bg-gray-100 p-5>
        <client-only>
          <table class="w-md  rounded">
            <tr>
              <td ref="col1" text-5xl font-bold>
                {{ isLetter1Spinnning ? 'X' : signs[0] }}
              </td>
              <td ref="col2" text-5xl font-bold>
                {{ isLetter2Spinnning ? 'X' : signs[1] }}
              </td>
              <td ref="col3" text-5xl font-bold>
                {{ isLetter3Spinnning ? 'X' : signs[2] }}
              </td>
            </tr>
          </table>
        </client-only>
      </div>

      <div m-5 space-x-10>
        <button v-if="sessionCredit" bg-gray-100 rounded px-2 py-1 hover-bg-gray-200 @click="isLetter3Spinnning ? null : startRolling()">
          {{ isLetter3Spinnning ? 'Spinning...' : 'Roll slots' }}
        </button>

        <button v-else bg-gray-100 rounded px-2 py-1 hover-bg-gray-200 @click="sessionStartCredits(true)">
          New Session
        </button>

        <button class="random" bg-gray-200 font-bold px-2 py-1 rounded absolute @mouseover="randomDirection">
          CASH OUT
        </button>
      </div>
    </div>
  </div>
</template>
