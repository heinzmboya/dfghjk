export const checkWinningRoll = async (incomingLetters: Array<string>) => {
  return incomingLetters[0] === incomingLetters[1] && incomingLetters[1] === incomingLetters[2]
}
