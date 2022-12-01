import { Startup } from "../util";

export function run() {
  const context = new Startup('00');

  let ct = 0;

  context.readData(line => {
    context.log.info(line);
    context.log.debug(`Line ${ct++}`);
  });
}

