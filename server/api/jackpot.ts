import { checkWinningRoll } from '~/composables/globals'

let credits = 10
let account = 0
let letters = []

const generateLetters = async (length = 3) => {
  let result = ''
  const characters = 'CLOW'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()
      * charactersLength))
  }
  return result.split('') as any
}

const testForReroll = async () => {
  // slightly cheat
  if (credits >= 40 && credits <= 60) {
    const random = Math.random()
    if (random < 0.3) { // 30% chance roll
      return await generateLetters()
    }
  }

  if (credits > 60) {
    const random = Math.random()
    if (random < 0.6) { // 60% chance roll
      return await generateLetters()
    }
  }

  return letters
}

const setCredit = async () => {
  switch (letters[0]) {
    case 'C':
      credits = credits + 10
      break

    case 'L':
      credits = credits + 20
      break

    case 'O':
      credits = credits + 30
      break

    case 'W':
      credits = credits + 40
      break

    default:
      break
  }
}

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const spin: boolean = body?.spin
  const cashOut: boolean = body?.cashOut
  const newSession: boolean = body?.newSession

  if (newSession) {
    credits = 10
    return { credits, account }
  }

  if (cashOut) {
    account = account + credits
    credits = 0
    return { account, credits }
  }

  if (spin) {
    letters = await generateLetters()
    const isWinningRoll = await checkWinningRoll(letters)

    if (isWinningRoll) {
      letters = await testForReroll()

      const reRollWin = await checkWinningRoll(letters)
      if (reRollWin)
        await setCredit()
      else credits--
    }
    else { credits-- }

    return { credits, letters }
  }

  return { credits, account }
})
