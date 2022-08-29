<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  signs: Array<string>
}
const { signs } = defineProps<Props>()

const col1 = ref<HTMLElement | null>(null)
const col2 = ref<HTMLElement | null>(null)
const col3 = ref<HTMLElement | null>(null)

let isLetter1Spinnning = $ref(false)
let isLetter2Spinnning = $ref(false)
let isLetter3Spinnning = $ref(false)

const startRollingAnimation = async () => {
  isLetter1Spinnning = true
  isLetter2Spinnning = true
  isLetter3Spinnning = true

  col1.value?.classList.add('animate-spin')
  col2.value?.classList.add('animate-spin')
  col3.value?.classList.add('animate-spin')
}

const removeSpin = (element: HTMLElement | null, time, spinState) => {
  setTimeout(() => {
    element?.classList.remove('animate-spin')
    spinState()
  }, time)
}

const stopRolling = async (setCreditFn) => {
  removeSpin(col1.value, 1000, async () => {
    isLetter1Spinnning = false
  })
  removeSpin(col2.value, 2000, () => isLetter2Spinnning = false)
  removeSpin(col3.value, 3000, () => {
    isLetter3Spinnning = false
    setCreditFn()
  })
}

defineExpose({
  stopRolling,
  startRollingAnimation,
  isSpinning: $$(isLetter3Spinnning), // && makes macro variable reactive in parent
})
</script>

<template>
  <client-only>
    <table class="w-md rounded">
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
</template>
