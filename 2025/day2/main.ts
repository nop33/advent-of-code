import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

const everyCharIsTheSame = (str: string): boolean => str.split('').every((char) => char === str[0])

const isInvalidId = (id: number): boolean => {
  const idString = id.toString()
  const length = idString.length

  if (part === 1) {
    if (length % 2) {
      return false
    } else {
      const firstHalf = idString.slice(0, length / 2)
      const secondHalf = idString.slice(length / 2)

      return firstHalf === secondHalf
    }
  }

  if (idString.length > 1 && idString.length < 4) {
    return everyCharIsTheSame(idString)
  }

  let index = 1
  let result = false

  while (index < length) {
    const chunk = idString.slice(0, index)

    if (idString.replaceAll(chunk, '').length === 0) {
      result = true
      break;
    } else {
      index++
    }
  }

  return result
}

const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const invalidIds: Array<number> = []

  for await (const line of rl) {
    const [startId, endId] = line.split('-').map(Number)

    let currentId = startId

    while (currentId <= endId) {
      if (isInvalidId(currentId)) {
        invalidIds.push(currentId)
      }

      currentId++
    }
  }

  console.log('Result', invalidIds.reduce((acc, id) => acc + id, 0))
}

main()
