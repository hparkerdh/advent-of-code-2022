import { Logger, Startup } from '../util';

export async function run() {
  const context = new Startup('04');
  let fullyContains: number = 0;
  let overlap: number = 0;

  await context.readData(line => {
    const elfPair = line.split(',').map(r => new ElfAssignment(r));
    if (elfPair[0].contains(elfPair[1]) || elfPair[1].contains(elfPair[0])) {
      fullyContains++;
    }
    if (elfPair[0].overlap(elfPair[1]) || elfPair[1].overlap(elfPair[0])) {
      overlap++;
    }
  });

  context.log.info(`There are ${fullyContains} pairs where one fully contains the another.`);
  context.log.info(`There are ${overlap} pairs where the assignments overlap.`);
}

class ElfAssignment {
  private _logger = new Logger('ElfAssignment');
  private _min: number;
  private _max: number;
  constructor(range: string) {
    const [a, b] = range.split('-').map(Number);
    if (a < b) {
      this._min = a;
      this._max = b;
    } else {
      this._min = b;
      this._max = a;
    }
    this._logger.debug(`New elf assignment - min: ${this._min}, max: ${this._max}`);
  }

  public get lowerBound(): number {
    return this._min;
  }

  public get upperBound(): number {
    return this._max;
  }

  /**
   * _Technically_ this is `contains` and `covers`
   */
  public contains(elf: ElfAssignment): boolean {
    return this.lowerBound <= elf.lowerBound &&
      this.upperBound >= elf.upperBound;
  }

  /**
   * Not the true topological overlap...
   */
  public overlap(elf: ElfAssignment): boolean {
    if (this.lowerBound >= elf.lowerBound && this.lowerBound <= elf.upperBound) {
      return true;
    }
    if (this.upperBound >= elf.lowerBound && this.upperBound <= elf.upperBound) {
      return true;
    }
    return false;
  }
}
