import * as fs from 'fs';
import * as readline from 'readline';

type Direction = 'R' | 'L'
type MoveProps = {
  direction: Direction
  steps: number
}

const args = process.argv.slice(2);
const partArg = parseInt(args[0]?.split('--part=')[1])
const part = partArg === 1 || partArg === 2 ? partArg : 1

const main = async () => {
  const fileStream = fs.createReadStream('input.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  let dial = 50
  let zeros = 0

  const move = ({ direction, steps }: MoveProps) => {
    if (direction === 'R') {
      const nextDial = dial + steps

      if (nextDial < 100) {
        dial = nextDial
      } else if (nextDial === 100) {
        dial = 0
        zeros++
      } else {
        if (part === 2 && dial !== 100) {
          zeros++
        }
        dial = 0
        move({ direction, steps: nextDial - 100 })
      }
    } else if (direction === 'L') {
      const nextDial = dial - steps

      if (nextDial > 0) {
        dial = nextDial
      } else if (nextDial === 0) {
        zeros++
        dial = 0
      } else {
        if (part === 2 && dial !== 0) {
          zeros++
        }
        dial = 100
        move({ direction, steps: nextDial * -1 })
      }
    }
  }

  for await (const line of rl) {
    const direction = line[0] as 'R' | 'L'
    const steps = parseInt(line.slice(1))

    move({ direction, steps })
  }

  console.log('zeros', zeros)
}

main()
