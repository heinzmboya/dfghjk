<script setup lang="ts">
interface Props {
  signs: Array<string>
}

interface Signs {
  letter: string
  loading: string
  svg?: string
}
const { signs } = defineProps<Props>()

const signs2 = reactive([{
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

let isLetter1Spinnning = $ref(false)
let isLetter2Spinnning = $ref(false)
let isLetter3Spinnning = $ref(false)

const svg = computed(() => {
  return signs.map((e) => {
    return svgArray[e]
  })
})

const startRollingAnimation = async () => {
  isLetter1Spinnning = true
  isLetter2Spinnning = true
  isLetter3Spinnning = true

  signs2.map(e => e.loading = true)
}

const timeout = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

const stopRolling = async (letters: Array<string>, setCreditFn: () => void) => {
  signs2.map((e, i) => e.svg = svgArray[letters[i]])

  await timeout(1000)
  isLetter1Spinnning = false
  signs2[0].loading = false

  await timeout(1000)
  isLetter2Spinnning = false
  signs2[1].loading = false

  await timeout(1000)
  isLetter3Spinnning = false
  signs2[2].loading = false
  setCreditFn()
}

defineExpose({
  stopRolling,
  startRollingAnimation,
  isSpinning: $$(isLetter3Spinnning), // && makes macro variable reactive in parent
})
</script>

<template>
  svg {{ svg }} <br>
  signs2 {{ signs2 }}
  <client-only>
    <table class="w-full rounded h-48 shadow-md">
      <tr>
        <td v-for="(sign, i) in signs2" :key="i" text-9xl font-bold class="w-1/3">
          <div
            v-if="sign.loading" class="spinner-div border-y-4 border-solid border-t-transparent"
            :class="[i === 1 && 'border-blue-500', i === 0 && 'border-yellow-500', i === 2 && 'border-green-500']"
          />
          <div v-else>
            <div :class="sign.svg" />
          </div>
        </td>
      </tr>
    </table>

    <table class="w-full rounded h-48 shadow-md">
      <tr>
        <td text-9xl font-bold class="w-1/3">
          <div
            v-if="isLetter1Spinnning"
            class="spinner-div border-y-4 border-solid border-yellow-500 border-t-transparent"
          />
          <div v-else>
            {{ signs[0] }}
          </div>
        </td>
        <td text-9xl font-bold class="w-1/3">
          <div v-if="isLetter2Spinnning" class="spinner-div border-y-4 border-blue-500 border-t-transparent" />
          <div v-else>
            {{ signs[1] }}
          </div>
        </td>
        <td text-9xl font-bold class="w-1/3">
          <div v-if="isLetter3Spinnning" class="spinner-div border-y-4 border-green-500 border-t-transparent" />
          <div v-else>
            {{ signs[2] }}
          </div>
        </td>
      </tr>
    </table>
  </client-only>
</template>
