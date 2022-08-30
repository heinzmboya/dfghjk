<script setup lang="ts">
let sessionCredit = $ref(0)
let userAccount = $ref(0)
let tableIsLoading = $ref(false)
let isgameSpinning = $ref(false)

const GameTableRef = ref<{ startRollingAnimation: Function; stopRolling: Function } | null>(null)

const setCredit = (credits) => {
  sessionCredit = credits
  isgameSpinning = false
}

const startRolling = async () => {
  if (isgameSpinning)
    return

  isgameSpinning = true
  GameTableRef.value?.startRollingAnimation()

  const data = await $fetch<{ letters: Array<string>; credits: number }>('/api/jackpot', {
    method: 'post',
    body: { spin: true },
  })

  GameTableRef.value?.stopRolling(data.letters, () => setCredit(data.credits))
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
  <div mx-auto w-xl space-y-5 text-gray-600>
    <div font-bold flex items-center space-x-20>
      <div flex items-center space-x-3>
        <div i-fluent-emoji:money-bag w-5 h-5 />
        <div>Account: {{ userAccount }}</div>
      </div>
      <div flex items-center space-x-3>
        <div i-fluent-emoji:credit-card w-5 h-5 />
        <div>Session Credit: {{ sessionCredit }}</div>
      </div>
    </div>
    <div bg-gray-100 p-5 rounded-lg>
      <div v-if="tableIsLoading" op50k italic w-xl>
        <span animate-pulse>Loading table...</span>
      </div>

      <game-table v-else ref="GameTableRef" />
    </div>

    <div m-5 space-y-4>
      <button
        v-if="sessionCredit" bg-gray-100 rounded px-3 py-1 w-30 hover-bg-gray-200 flex items-center
        @click="startRolling"
      >
        <div i-fluent-emoji:round-pushpin mr-2 />
        {{ isgameSpinning ? 'rolling...' : 'Roll slots' }}
      </button>

      <button
        v-else bg-gray-100 rounded px-2 py-1 hover-bg-gray-200 flex items-center
        @click="sessionStartCredits(true)"
      >
        <div i-fluent-emoji:new-button mr-2 />
        New Session
      </button>

      <cashout-button :cash-out="cashOut" />
    </div>
  </div>
</template>

