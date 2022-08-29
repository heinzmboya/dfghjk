<script setup lang="ts">
let sessionCredit = $ref(0)
let userAccount = $ref(0)
let tableIsLoading = $ref(false)

const GameTableRef = ref<{ startRollingAnimation: Function; stopRolling: Function; isSpinning: boolean } | null>(null)

const signs = ref(['C', 'L', 'O'])

const setCredit = (credits) => {
  sessionCredit = credits
}

const startRolling = async () => {
  if (GameTableRef.value?.isSpinning)
    return

  GameTableRef.value?.startRollingAnimation()

  const data = await $fetch<{ letters: Array<string>; credits: number }>('/api/jackpot', {
    method: 'post',
    body: { spin: true },
  })
  signs.value = data.letters

  GameTableRef.value?.stopRolling(() => setCredit(data.credits))
}

async function cashOut() {
  const data = await $fetch<{ account: number; credits: number }>('/api/jackpot', {
    method: 'post',
    body: { cashOut: true },
  })
  userAccount = data.account
  sessionCredit = data.credits
}

async function sessionStartCredits(state = false) {
  const data = await $fetch<{ account: number; credits: number }>('/api/jackpot', {
    method: 'post',
    body: { newSession: state },
  })
  sessionCredit = data.credits
  userAccount = data.account
  // tableIsLoading = false
}

tableIsLoading = true
await sessionStartCredits() // allocate 10 credits on game launch

onMounted(() => {
  tableIsLoading = false
})
</script>

<template>
  <div mx-auto w-md space-y-5>
    <div>
      <div> Account: {{ userAccount }}</div>
      <div> Session Credit: {{ sessionCredit }}</div>
      <div v-if="signs.length" bg-gray-100 p-5>
        <div v-if="tableIsLoading" op50k italic>
          <span animate-pulse>Loading table...</span>
        </div>

        <game-table v-else ref="GameTableRef" :signs="signs" />
      </div>

      <div m-5 space-x-10>
        <button
          v-if="sessionCredit" bg-gray-100 rounded px-3 py-1 w-30 hover-bg-gray-200
          @click="startRolling"
        >
          {{ GameTableRef?.isSpinning ? 'rolling...' : 'Roll slots' }}
        </button>

        <button v-else bg-gray-100 rounded px-2 py-1 hover-bg-gray-200 @click="sessionStartCredits(true)">
          New Session
        </button>

        <cashout-button :cash-out="cashOut" />
      </div>
    </div>
  </div>
</template>

