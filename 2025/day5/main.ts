import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const freshIngredientsRanges: Array<Array<number>> = []
  let totalFreshAvailableIngredients = 0

  for await (const line of rl) {
    if (line.includes('-')) {
      freshIngredientsRanges.push(line.split('-').map(Number))
    } else if (part === 1 &&line.length > 0) {
      const id = parseInt(line)
      const isWithinARange = freshIngredientsRanges.some((range) => id >= range[0] && id <= range[1])
      totalFreshAvailableIngredients += isWithinARange ? 1 : 0
    }
  }

  if (part === 1) {
    console.log('Fresh ingredients:', totalFreshAvailableIngredients)
  }
}

main()
