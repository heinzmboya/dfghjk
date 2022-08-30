<script setup lang="ts">
interface Props {
  signs: Array<string>
}
const { signs } = defineProps<Props>()

let isLetter1Spinnning = $ref(false)
let isLetter2Spinnning = $ref(false)
let isLetter3Spinnning = $ref(false)

const startRollingAnimation = async () => {
  isLetter1Spinnning = true
  isLetter2Spinnning = true
  isLetter3Spinnning = true
}

const timeout = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

const stopRolling = async (setCreditFn: () => void) => {
  await timeout(1000)
  isLetter1Spinnning = false

  await timeout(1000)
  isLetter2Spinnning = false

  await timeout(1000)
  isLetter3Spinnning = false
  setCreditFn()
}

defineExpose({
  stopRolling,
  startRollingAnimation,
  isSpinning: $$(isLetter3Spinnning), // && makes macro variable reactive in parent
})
</script>

<template>
  <client-only>
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
