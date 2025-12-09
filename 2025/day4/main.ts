import { Interface } from 'readline';
import { createReadlineInterfaceFromFile, getPartArgument } from '../utils/utils.ts';

const part = getPartArgument()

type MatrixReturnType = {
  matrix: Array<Array<string>>
  numberOfRows: number
  numberOfColumns: number
}

const constructMatrix = async (rl: Interface): Promise<MatrixReturnType> => {
  const matrix: Array<Array<string>> = [[]]

  let numberOfRows = 0, numberOfColumns = 0
  for await (const line of rl) {
    let charIndex = 0
    for (const char of line) {
      const line = matrix[numberOfRows]

      if (!line) {
        matrix[numberOfRows] = []
      }

      matrix[numberOfRows][charIndex] = char
      charIndex++
      numberOfColumns = charIndex
    }
    numberOfRows++
  }

  return { matrix, numberOfRows, numberOfColumns }
}

const checkSurroundings = (matrix: Array<Array<string>>, row: number, col: number) => {
  const rowAbove = row > 0 ? row - 1 : null
  const rowBelow = row < matrix.length - 1 ? row + 1 : null
  const colLeft = col > 0 ? col - 1 : null
  const colRight = col < matrix[0].length - 1 ? col + 1 : null

  let numberOfRolesAround = 0

  const positionsToCheck = [
    { row: rowAbove, col: colLeft },
    { row: rowAbove, col },
    { row: rowAbove, col: colRight },
    { row, col: colRight },
    { row: rowBelow, col: colRight },
    { row: rowBelow, col },
    { row: rowBelow, col: colLeft },
    { row: row, col: colLeft }
  ]

  for (const position of positionsToCheck) {
    if (position.row !== null && position.col !== null) {
      if (matrix[position.row][position.col] == '@') {
        numberOfRolesAround++
      }
    }
  }

  return numberOfRolesAround
}


const main = async () => {
  const rl = createReadlineInterfaceFromFile('input.txt')

  const { matrix, numberOfRows, numberOfColumns } = await constructMatrix(rl)

  let accessibleRoles = 0

  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfColumns; col++) {
      const char = matrix[row][col]

      if (char == '@') {
        const numberOfRolesAround = checkSurroundings(matrix, row, col)

        if (numberOfRolesAround < 4) {
          accessibleRoles++
        }
      }
    }
  }

  console.log('accessibleRoles', accessibleRoles)
}

main()
