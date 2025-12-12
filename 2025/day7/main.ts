import { Interface } from 'readline';
import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

async function* getEvenRows(rl: Interface) {
  let row = 0
  for await (const line of rl) {
    if (row % 2 === 0) {
      yield line
    }
    row++
  }
}

const part1 = async (rl: Interface) => {
  let total = 0
  let row = 0

  const raysPerRow = {
    previousRow: new Set(),
    currentRow: new Set()
  }

  for await (const line of getEvenRows(rl)) {
    let column = 0

    for (const item of line.split('')) {
      if (row === 0) {
        if (item === 'S') raysPerRow.currentRow.add(column)
      } else {
        if (raysPerRow.previousRow.has(column)) {
          if (item === '^') {
            total++
            raysPerRow.currentRow.add(column - 1)
            raysPerRow.currentRow.add(column + 1)
          } else {
            raysPerRow.currentRow.add(column)
          }
        }
      }
      column++
    }

    raysPerRow.previousRow = new Set(raysPerRow.currentRow)
    raysPerRow.currentRow.clear()
    row++
  }

  return total
}

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const total = await part1(rl)

  console.log('Total:', total)
}

main()
