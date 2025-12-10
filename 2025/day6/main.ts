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

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

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

  console.log('Total:', total)
}

main()
