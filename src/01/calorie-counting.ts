import { Startup } from "../util";

export async function run() {
  const context = new Startup('01');

  let currentElfCalories: number = 0;
  let maximumElfCalories: number[] = [];

  await context.readData(line => {
    context.log.debug(`Reading line: ${line}`);
    if (line.trim().length) {
      currentElfCalories += Number(line);
      context.log.debug(`Current elf calories: ${currentElfCalories}`);
    } else {
      maximumElfCalories.push(currentElfCalories);
      maximumElfCalories = manageMaximumElfCalories(maximumElfCalories);
      context.log.debug(`Current maximum elf calories: ${maximumElfCalories}`);
      currentElfCalories = 0;
    }
  });

  if (currentElfCalories != 0) {
    maximumElfCalories.push(currentElfCalories);
    maximumElfCalories = manageMaximumElfCalories(maximumElfCalories);
    context.log.debug(`Current maximum elf calories: ${maximumElfCalories}`);
  }

  maximumElfCalories = manageMaximumElfCalories(maximumElfCalories);

  context.log.info(`The elf carrying the most calories has ${maximumElfCalories[0]}.`);

  context.log.info(`The sum of the top three most carried calories is ${maximumElfCalories.reduce((s, c) => s + c)}.`);
}

function manageMaximumElfCalories(m: number[]) {
  return m.sort((a, b) => b - a).slice(0, 3);
}
