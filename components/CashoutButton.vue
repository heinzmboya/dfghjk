<script setup lang="ts">
const { cashOut } = defineProps<{
  cashOut: Function
}>()

const BtnRef = ref<HTMLElement | null>(null)

const randomDirection = () => {
  const random = Math.random()
  if (random > 0.5)
    return // 50% chance it moves

  const plusOrMinus = Math.random() < 0.5 ? -1 : 1

  const rect = BtnRef.value!.getBoundingClientRect() // current position

  const width = window.innerWidth - 100 // -100 to prevent horintal overflow

  let newPosition = (rect.left + (plusOrMinus * 300))
  if (newPosition > width)
    newPosition = (rect.left - 300)

  if (newPosition < 0)
    newPosition = (rect.left + 300)

  BtnRef.value!.style.left = `${newPosition}px`
}

// animate if unclickable
let timer: NodeJS.Timeout | undefined
const animateBtn = (anim) => {
  clearTimeout(timer)
  BtnRef.value?.classList.add(anim)

  timer = setTimeout(() => {
    BtnRef.value?.classList.remove(anim)
  }, 500)
}

const onCashOut = () => {
  const random = Math.random()
  if (random < 0.4) {
    animateBtn('animate-head-shake')
    return // 40% chance it doesnt click
  }

  cashOut()
  animateBtn('animate-flash')
}
</script>

<template>
  <button
    ref="BtnRef" z-10 bg-gray-200 hover:bg-gray-300 font-bold px-2 py-1 rounded absolute @click="onCashOut"
    @mouseover="randomDirection"
  >
    CASH OUT
  </button>
</template>

