import { Interface } from 'readline';
import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

function* getItem(line: string) {
  let endIndex = 0

  while (endIndex < line.length) {
    let startIndex = endIndex
    endIndex = line.indexOf(' ', startIndex)

    if (endIndex === -1) {
      yield line.slice(startIndex)
      break
    } else if (endIndex !== startIndex) {
      yield line.slice(startIndex, endIndex)
    }
    endIndex++
  }
}

const part1 = async (rl: Interface) => {
  let total = 0
  let row = 0
  const columnsArray: Array<Array<number>> = []

  for await (const line of rl) {
    let column = 0

    for (const item of getItem(line)) {
      if (item !== '*' && item !== '+') {
        if (!columnsArray[column]) {
          columnsArray[column] = []
        }
        columnsArray[column].push(parseInt(item))
      } else {
        total += columnsArray[column].reduce((acc, num) => item === '*' ? acc * num : acc + num, item === '*' ? 1 : 0)
      }
      column++
    }
    row++
  }

  return total
}

const part2 = async (rl: Interface) => {
  const matrix: Array<Array<string>> = []
  let row = 0

  for await (const line of rl) {
    for (const item of line.split('')) {
      if (!matrix[row]) {
        matrix[row] = []
      }
      matrix[row].push(item)
    }
    row++
  }

  let maxLength = 0
  for (const row of matrix) {
    if (row.length > maxLength) {
      maxLength = row.length
    }
  }

  let total = 0
  let columnNumber = 0
  let numbersToCalculate: Array<number> = []

  for (let i = maxLength - 1; i >= 0; i--) {
    let operator: string | undefined = undefined
    let columnNumberDigits: Array<string> = []

    for (const row of matrix) {
      const item = row[i]
      if (item) {
        if (item === '*' || item === '+') {
          operator = item
        } else if (item !== ' ') {
          columnNumberDigits.push(item)
        }
      }
    }

    if (columnNumberDigits.length > 0) {
      console.log({ columnNumberDigits })
      columnNumber = parseInt(columnNumberDigits.join(''))
      console.log({ columnNumber })
      numbersToCalculate.push(columnNumber)
    }

    if (operator) {
       total += numbersToCalculate.reduce((acc, num) => operator === '*' ? acc * num : acc + num, operator === '*' ? 1 : 0)
       columnNumber = 0
       numbersToCalculate = []
    }
  }

  return total
}

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const total = part === 1 ? await part1(rl) : await part2(rl)

  console.log('Total:', total)
}

main()
