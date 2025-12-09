import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const freshIngredientsRanges: Array<[number, number]> = []
  let totalFreshAvailableIngredients = 0

  for await (const line of rl) {
    if (line.includes('-')) {
      const [start, end] = line.split('-').map(Number)
      freshIngredientsRanges.push([start, end])
    } else if (part === 1 && line.length > 0) {
      const id = parseInt(line)
      const isWithinARange = freshIngredientsRanges.some((range) => id >= range[0] && id <= range[1])
      totalFreshAvailableIngredients += isWithinARange ? 1 : 0
    }
  }

  if (part === 2) {
    freshIngredientsRanges.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])

    totalFreshAvailableIngredients = 0
    const latestRange = { start: 0, end: 0 }

    for (let i = 0; i < freshIngredientsRanges.length; i++) {
      const [start, end] = freshIngredientsRanges[i]

      if (start > latestRange.end) {
        totalFreshAvailableIngredients += end - start + 1
        latestRange.start = start
        latestRange.end = end
      } else if (start >= latestRange.start && end <= latestRange.end) {
        continue
      } else if (start >= latestRange.start && start <= latestRange.end) {
        totalFreshAvailableIngredients += end - latestRange.end
        latestRange.end = end
      }
    }
  }

  console.log('Fresh ingredients:', totalFreshAvailableIngredients)
}

main()
