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

type Node = {
  index: number
  leftChild: Node | undefined
  rightChild: Node | undefined
}

const buildGraph = async (rl: Interface) => {
  let total = 0
  let row = 0
  let rootNode = { index: 0, leftChild: undefined, rightChild: undefined}
  const raysPerRow: { previousRow: Array<Node>, currentRow: Array<Node> } = { previousRow: [], currentRow: [] }

  for await (const line of getEvenRows(rl)) {
    let column = 0

    for (const item of line.split('')) {
      if (row === 0) {
        if (item === 'S') {
          rootNode = { index: column, leftChild: undefined, rightChild: undefined}
          raysPerRow.currentRow.push(rootNode)
        }
      } else {
        const incomingRay = raysPerRow.previousRow.find((n) => n.index === column)

        if (incomingRay) {
          if (item === '^') {
            const leftChildIndex = column - 1
            const rightChildIndex = column + 1
            const existingCurrentLeft = raysPerRow.currentRow.find((n) => n.index === leftChildIndex )
            const existingCurrentRight = raysPerRow.currentRow.find((n) => n.index === rightChildIndex )
            const existingPreviousLeft = raysPerRow.previousRow.find((n) => n.index === leftChildIndex )
            const existingPreviousRight = raysPerRow.previousRow.find((n) => n.index === rightChildIndex )

            incomingRay.leftChild = existingCurrentLeft ?? existingPreviousLeft ?? { index: leftChildIndex, leftChild: undefined, rightChild: undefined }
            incomingRay.rightChild = existingCurrentRight ?? existingPreviousRight ?? { index: rightChildIndex, leftChild: undefined, rightChild: undefined }
            raysPerRow.currentRow.push(incomingRay.leftChild)
            raysPerRow.currentRow.push(incomingRay.rightChild)
          } else {
            raysPerRow.currentRow.push(incomingRay)
          }
        }
      }
      column++
    }

    raysPerRow.previousRow = [...raysPerRow.currentRow]
    raysPerRow.currentRow = []
    row++
  }

  return rootNode
}

const knownPathsCounts = new Map<Node, number>()

const countPathsToLeaves = (node: Node): number => {
  const knownCount = knownPathsCounts.get(node)
  if (knownCount) return knownCount

  if (!node.leftChild && !node.rightChild) return 1

  let count = 0
  if (node.leftChild) {
    count += countPathsToLeaves(node.leftChild)
  }
  if (node.rightChild) {
    count += countPathsToLeaves(node.rightChild)
  }

  knownPathsCounts.set(node, count)
  return count
}

const part2 = async (rl: Interface) => {
  const rootNode = await buildGraph(rl)
  const total = countPathsToLeaves(rootNode)
  return total
}

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const total = part === 1 ? await part1(rl) : await part2(rl)

  console.log('Total:', total)
}

main()
