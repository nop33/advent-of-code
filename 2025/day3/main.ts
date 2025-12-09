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

const processLinePart1 = (numberString: string): number => {
  const { largest, secondLargest, largestIndex } = findLargestPair(numberString)

  if (largestIndex === numberString.length - 1) {
    return parseInt(`${secondLargest}${largest}`)
  }

  const { largest: secondDigit } = findLargestPair(numberString.slice(largestIndex + 1))

  return parseInt(`${largest}${secondDigit}`)
}

const findSubstringsWithAtLeastXDigitsAfterLargestDigit = (numberString: string, minDigitsAfter: number) => {
  const numberIndexes: Map<number, Array<number>> = new Map()
  let largest = 0

  for (let i = 0; i < numberString.length; i++) {
    const number = parseInt(numberString[i])
    const indexesOfNumber = numberIndexes.get(number)

    if (indexesOfNumber) {
      indexesOfNumber.push(i)
    } else {
      numberIndexes.set(number, [i])
    }

    if (number > largest) {
      largest = number
    }
  }

  const potentialLargestNumbers: Array<string> = []
  let nextLargest = largest

  while (nextLargest > 0) {
    const indexesOfNextLargest = numberIndexes.get(nextLargest)

    if (indexesOfNextLargest) {
      for (const indexOfNextLargest of indexesOfNextLargest) {
        if (indexOfNextLargest <= (numberString.length - (minDigitsAfter + 1))) {
          potentialLargestNumbers.push(numberString.slice(indexOfNextLargest))
        }
      }

      if (potentialLargestNumbers.length > 0) {
        break
      }
    }

    nextLargest--
  }

  return {
    largestDigit: nextLargest,
    substringsToCheck: potentialLargestNumbers.map(substring => substring.slice(1)).filter(substring => substring.length > 0),
  }
}

const processLinePart2 = (numberString: string) => {
  let result = ''
  let digitsRequired = 11
  let largestDigitOfSubstrings = 0
  let largestDigitOfSubstringsSubstrings: Array<string> = []
  const nextSubstrings: Array<string> = [numberString]

  while (result.length < 12) {
    const nextSubstring = nextSubstrings.pop()

    if (!nextSubstring) {
      continue
    }

    const { largestDigit, substringsToCheck } = findSubstringsWithAtLeastXDigitsAfterLargestDigit(nextSubstring, digitsRequired)

    if (largestDigit > largestDigitOfSubstrings) {
      largestDigitOfSubstrings = largestDigit
      largestDigitOfSubstringsSubstrings = substringsToCheck
    } else if (largestDigit === largestDigitOfSubstrings) {
      largestDigitOfSubstringsSubstrings = Array.from(new Set([...largestDigitOfSubstringsSubstrings, ...substringsToCheck]))
    }

    if (nextSubstrings.length === 0) {
      result += largestDigitOfSubstrings
      nextSubstrings.push(...largestDigitOfSubstringsSubstrings)
      digitsRequired--
      largestDigitOfSubstrings = 0
      largestDigitOfSubstringsSubstrings = []
    }
  }

  return parseInt(result)
}

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')
  const processLine = part === 1 ? processLinePart1 : processLinePart2
  let result = 0

  for await (const line of rl) {
    result += processLine(line)
  }

  console.log('Result', result)
}

main()
