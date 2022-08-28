<script setup lang="ts">
let sessionCredit = $ref(0)
let isLetter1Spinnning = $ref(false)
let isLetter2Spinnning = $ref(false)
let isLetter3Spinnning = $ref(false)

const row1 = ref<HTMLElement | null>(null)
const row2 = ref<HTMLElement | null>(null)
const row3 = ref<HTMLElement | null>(null)

const signs = ref(['C', 'C', 'C'])

const removeSpin = (element: HTMLElement | null, time, spinState) => {
  setTimeout(() => {
    element?.classList.remove('animate-spin')
    spinState()
  }, time)
}

const addSpin = async () => {
  let data
  if (isLetter1Spinnning) {
    removeSpin(row1.value, 1000, async () => {
      isLetter1Spinnning = false
      data = await $fetch('/api/jackpot')
      signs.value = data.letters
    })
    removeSpin(row2.value, 2000, () => isLetter2Spinnning = false)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    removeSpin(row3.value, 3000, () => { isLetter3Spinnning = false; setCredit(data.credits) })
    return
  }

  isLetter1Spinnning = true
  isLetter2Spinnning = true
  isLetter3Spinnning = true

  row1.value?.classList.add('animate-spin')
  row2.value?.classList.add('animate-spin')
  row3.value?.classList.add('animate-spin')

  setTimeout(() => {
    addSpin()
  }, 1000)
}

const setCredit = (credits) => {
  if (signs.value[0] === signs.value[1] && signs.value[1] === signs.value[2])

    sessionCredit = credits
}

const randomDirection = () => {
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1
  const ball: any = document.querySelector('.random')

  const rect = ball.getBoundingClientRect()

  ball.style.left = `${rect.left + (plusOrMinus * 300)}px`
}
</script>

<template>
  <div>
    <div mx-auto w-md space-y-5>
      <div> Session Credit: {{ sessionCredit }}</div>
      <div bg-gray-100 p-5>
        <table class="w-md  rounded">
          <tr>
            <td ref="row1" text-5xl font-bold>
              {{ isLetter1Spinnning ? 'X' : signs[0] }}
            </td>
            <td ref="row2" text-5xl font-bold>
              {{ isLetter2Spinnning ? 'X' : signs[1] }}
            </td>
            <td ref="row3" text-5xl font-bold>
              {{ isLetter3Spinnning ? 'X' : signs[2] }}
            </td>
          </tr>
        </table>
      </div>

      <div m-5 space-x-10>
        <button @click="addSpin">
          {{ isLetter3Spinnning ? 'Spinning...' : 'Roll slots' }}
        </button>

        <button class="random" bg-gray-200 font-bold px-2 py-1 rounded absolute @mouseover="randomDirection">
          CASH OUT
        </button>
      </div>
    </div>
  </div>
</template>

