// const startAt = Date.now()
const credits = 10
let letters = []

const generateLetters = (length = 3) => {
  let result = ''
  const characters = 'CLOW'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()
            * charactersLength))
  }
  letters = result.split('') as any
}

export default async () => {
  generateLetters()
  return { credits, letters }
}
