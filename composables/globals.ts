export const useCounter = () => useState<number>('counter', () => 0)
export const useColor1 = () => useState<string>('color', () => 'pink')

export const useColor = () => 'pink'

export const checkWinningRoll = async (incomingLetters: Array<string>) => {
  return incomingLetters[0] === incomingLetters[1] && incomingLetters[1] === incomingLetters[2]
}
