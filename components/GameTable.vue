<script setup lang="ts">
const signs = reactive([{
  svg: 'i-fluent-emoji:cherries',
  loading: false,
}, {
  svg: 'i-fluent-emoji:lemon',
  loading: false,
}, {
  svg: 'i-fluent-emoji:watermelon',
  loading: false,
}])

const svgArray
  = {
    C: 'i-fluent-emoji:cherries',
    L: 'i-fluent-emoji:lemon',
    O: 'i-fluent-emoji:orange-circle',
    W: 'i-fluent-emoji:watermelon',
  }

let signLetters = $ref(['C', 'L', 'O'])

const startRollingAnimation = async () => {
  signs.map(e => e.loading = true)
}

const shootConfetti = async () => {
  interface fnType {
    default: Function
    create: Function
  }
  const confetti = await import('https://cdn.skypack.dev/canvas-confetti') as fnType
  confetti.default()
}

const timeout = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

const stopRolling = async (letters: Array<string>, setCreditFn: () => void) => {
  signs.map((e, i) => {
    signLetters = letters
    return e.svg = svgArray[letters[i]]
  })

  await timeout(1000)
  signs[0].loading = false

  await timeout(1000)
  signs[1].loading = false

  await timeout(1000)
  signs[2].loading = false
  setCreditFn()

  const { checkWinningRoll } = await import('~/composables/globals')
  const isWinningRoll = await checkWinningRoll(letters)

  if (isWinningRoll)
    shootConfetti()
}

defineExpose({
  stopRolling,
  startRollingAnimation,
})
</script>

<template>
  <client-only>
    <table class="w-full rounded h-48 shadow-md">
      <tr>
        <td v-for="(sign, i) in signs" :key="i" font-bold class="w-1/3">
          <div
            v-if="sign.loading" class="spinner-div border-y-4 border-solid border-t-transparent"
            :class="[i === 1 && 'border-blue-500', i === 0 && 'border-yellow-500', i === 2 && 'border-green-500']"
          />
          <div v-else>
            <div :class="sign.svg" mx-auto text-9xl />
            <!-- <span text-xs font-light>{{ signLetters[i] }}</span> -->
          </div>
        </td>
      </tr>
    </table>
  </client-only>
</template>
