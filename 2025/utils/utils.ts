import * as fs from 'fs';
import * as readline from 'readline';

export const createReadlineInterfaceFromFile = (filePath: string): readline.Interface => readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity
})

export const getPartArgument = (): 1 | 2 => {
  const args = process.argv.slice(2);
  const partArg = parseInt(args[0]?.split('--part=')[1])

  return partArg === 1 || partArg === 2 ? partArg : 1
}
