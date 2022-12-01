import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline/promises';

export async function readData(day: string, test: boolean, cb: (line: string) => void): Promise<void> {
  const rl = createInterface(createReadStream(resolve('data', day, `${test ? 'test' : 'data'}.txt`)));
  return new Promise(res => {
    rl.on('line', cb);
    rl.on('close', () => res());
  });
}
