let credits = 10
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

const setCredit = async (letters) => {
  if (letters[0] === letters[1] && letters[1] === letters[2]) {
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
  else {
    credits--
  }
}

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const spin: boolean = body?.spin

  if (spin) {
    letters = await generateLetters()
    await setCredit(letters)
    return { credits, letters }
  }

  return { credits }
})
