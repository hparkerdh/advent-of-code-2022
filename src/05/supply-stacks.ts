import { Startup } from '../util';

export async function run() {
  const context = new Startup('05');
  let stackParsing: boolean = true;
  const stacks_9000: string[][] = [];
  const stacks_9001: string[][] = [];

  await context.readData(line => {
    if (line.trim().length == 0) {
      // end stack parsing
      if (stackParsing) {
        // We were reading the file from top to bottom,
        // but pushing to the array is adding from bottom to top.
        stacks_9000.forEach(stack => stack.reverse());
        stacks_9001.forEach(stack => stack.reverse());
      }
      stackParsing = false;
    } else if (stackParsing) {
      let tmp = line;
      let ct = 0;
      while (tmp.trim().length > 0) {
        if (stacks_9000.length <= ct) {
          stacks_9000.push([]);
        }
        if (stacks_9001.length <= ct) {
          stacks_9001.push([]);
        }
        let crate = tmp.substring(0, 4).trim()[1];
        if (typeof crate === 'string') {
          stacks_9000[ct].push(crate);
          stacks_9001[ct].push(crate);
        }
        tmp = tmp.substring(4);
        ct++;
      }
    } else {
      // move parsing
      let ct: number | undefined;
      let from: number | undefined;
      let to: number | undefined;

      let state: number = 0;
      line.split(' ').forEach(segment => {
        let stateAdjusted: boolean = true;
        switch(segment.trim()) {
          case 'move':
            state = 1;
            break;
          case 'from':
            state = 2;
            break;
          case 'to':
            state = 3;
            break;
          default:
            stateAdjusted = false;
        }

        if (!stateAdjusted) {
          switch(state) {
            case 1:
              ct = Number(segment.trim());
              break;
            case 2:
              from = Number(segment.trim());
              break;
            case 3:
              to = Number(segment.trim());
              break;
          }
        }
      });

      if (typeof ct != 'number' || typeof from != 'number' || typeof to != 'number') {
        context.log.error(`Error parsing crate move! ct: ${ct}, from: ${from}, to: ${to}`);
      } else if (ct < 0 || from < 1 || from > stacks_9000.length || to < 1 || to > stacks_9000.length) {
        context.log.error(`Index out of bounds! ct: ${ct}, from: ${from}, to: ${to}, stacks.length: ${stacks_9000.length}`);
      } else {
        // CrateMover 9000
        for (let i = 0; i < ct; i++) {
          let crate = stacks_9000[from - 1].pop();
          if (typeof crate == 'string') {
            stacks_9000[to - 1].push(crate);
          } else {
            context.log.error(`Missing crate! ct: ${ct}, i: ${i}, from: ${from}, to: ${to}`);
          }
        }
        // CrateMover 90001
        const crateStack: string[] = [];
        for (let i = 0; i < ct; i++) {
          let crate = stacks_9001[from -1].pop();
          if (typeof crate == 'string') {
            crateStack.push(crate);
          } else {
            context.log.error(`Missing crate(2)! ct: ${ct}, i: ${i}, from: ${from}, to: ${to}`);
          }
        }
        crateStack.reverse();
        crateStack.forEach(crate => {
          stacks_9001[to! - 1].push(crate);
        });
      }
    }
  });

  context.log.debug('CrateMover9000');
  stacks_9000.forEach((stack, i) => {
    context.log.debug(`${i}: [${stack.join('] [')}]`);
  });
  context.log.debug('CrateMover9001');
  stacks_9001.forEach((stack, i) => {
    context.log.debug(`${i}: [${stack.join('] [')}]`);
  });

  const tops_9000 = stacks_9000.reduce((result, stack) => {
    return result += stack[stack.length - 1];
  }, '');
  const tops_9001 = stacks_9001.reduce((result, stack) => {
    return result += stack[stack.length - 1];
  }, '');
  
  context.log.info(`The tops of the stacks moved by CrateMover9000 are: ${tops_9000}`);
  context.log.info(`The tops of the stacks moved by CrateMover9001 are: ${tops_9001}`);
}
