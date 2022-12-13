import { Logger, Startup } from "../util";

export async function run() {
  const context = new Startup('03');
  let misplacedPrioritySum = 0;
  let badgePrioritySum = 0;
  let elfGroupMembers: Rucksack[] = [];

  await context.readData(line => {
    const sack = new Rucksack(line);
    const commonTypes = sack.commonItemTypes();
    const priority = getItemTypePriority(commonTypes[0]);
    context.log.verbose(`Common type ${commonTypes[0]} has priority ${priority}`);
    misplacedPrioritySum += priority;

    elfGroupMembers.push(sack);

    if (elfGroupMembers.length == 3) {
      const elfGroup = new ElfGroup(elfGroupMembers[0], elfGroupMembers[1], elfGroupMembers[2]);
      const badge = elfGroup.badgeType;
      if (badge == undefined) {
        context.log.error(`Unable to determine badge type!`);
      } else {
        const badgePriority = getItemTypePriority(badge);
        context.log.verbose(`Badge type ${badge} has priority ${badgePriority}`);
        badgePrioritySum += badgePriority;
      }
      elfGroupMembers = [];
    }
  });

  context.log.info(`The overall common type priority sum is ${misplacedPrioritySum}.`);

  context.log.info(`The overall badge priority sum is ${badgePrioritySum}.`);
}

class Rucksack {
  private _compartmentA: string;
  private _compartmentB: string;
  private _logger: Logger = new Logger('Rucksack');

  constructor(private _contents: string) {
    this._compartmentA = _contents.substring(0, _contents.length / 2);
    this._compartmentB = _contents.substring(_contents.length / 2, _contents.length);
    this._logger.debug(`Rucksack first compartment: ${this._compartmentA}`);
    this._logger.debug(`Rucksack second compartment: ${this._compartmentB}`);
  }

  public get contents(): string {
    return this._contents;
  }

  public commonItemTypes(): string[] {
    const result: string[] = []
    for (let i = 0; i < this._compartmentA.length; i++) {
      if (this._compartmentB.includes(this._compartmentA[i])) {
        result.push(this._compartmentA[i]);
        this._logger.verbose(`Common item type ${this._compartmentA[i]} found.`);
      }
    }
    return result;
  }
}

class ElfGroup {
  private _badgeType?: string;

  constructor(private _elf1: Rucksack, private _elf2: Rucksack, private _elf3: Rucksack) {}

  public get badgeType(): string | undefined {
    if (typeof this._badgeType == 'string') {
      return this._badgeType;
    } else {
      for (let i = 0; i < this._elf1.contents.length; i++) {
        if (
          this._elf2.contents.includes(this._elf1.contents[i]) &&
          this._elf3.contents.includes(this._elf1.contents[i])
        ) {
          return this._badgeType = this._elf1.contents[i];
        }
      }
    }
  }
}

/**
 * ASCII [A..Z] is 65..90, and [a..z] is 97..122
 * This challenge has [a..z] -> 1..26 and [A..Z] -> 27..52
 */
function getItemTypePriority(itemTypeChar: string): number {
  let result = itemTypeChar.charCodeAt(0) - 96;
  // 52 is offset of 2 alphabets (26 + 26)
  // 6 is the gap between Z and a in ASCII
  if (result < 0) return result + 52 + 6;
  return result;
}
