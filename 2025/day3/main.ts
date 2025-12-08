import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

const findLargestPair = (numberString: string): { largest: number, secondLargest: number, largestIndex: number } => {
  let largest = 0
  let secondLargest = 0
  let largestIndex = 0

  for (let i = 0; i < numberString.length; i++) {
    const number = parseInt(numberString[i])

    if (number > largest) {
      secondLargest = largest
      largest = number
      largestIndex = i
    }
  }

  return { largest, secondLargest, largestIndex }
}

const findLargest = (numberString: string): number => {
  const { largest, secondLargest, largestIndex } = findLargestPair(numberString)

  if (largestIndex === numberString.length - 1) {
    return parseInt(`${secondLargest}${largest}`)
  }

  const { largest: secondDigit } = findLargestPair(numberString.slice(largestIndex + 1))

  return parseInt(`${largest}${secondDigit}`)
}

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  let result = 0

  for await (const line of rl) {
    result += findLargest(line)
  }

  console.log('Result', result)
}

main()
