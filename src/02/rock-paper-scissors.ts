import { ChildProcess } from 'child_process';
import { Logger, Startup } from '../util';

export async function run() {
  const context = new Startup('02');

  let part1Score = 0;
  let part2Score = 0;
  let game = new RockPaperScissors();

  await context.readData(line => {
    const [opponent, me] = line.trim().split(' ').map(a => a.trim()) as [Choices, string];

    let part1Mapped: Choices;

    switch (me) {
      case 'X':
        part1Mapped = 'A';
        break;
      case 'Y':
        part1Mapped = 'B';
        break;
      case 'Z':
      default:
        part1Mapped = 'C';
        break;
    }

    context.log.debug(`Game 1 - Opponent: ${opponent}, me: ${me}, mapped: ${part1Mapped}`);

    part1Score += getChoicePoints(part1Mapped) + getGamePoints(game.compete(opponent, part1Mapped));

    let part2Mapped: Choices;

    switch (me) {
      case 'X':
        part2Mapped = game.getPrey(opponent);
        break;
      case 'Y':
        part2Mapped = opponent;
        break;
      case 'Z':
      default:
        part2Mapped = game.getPredator(opponent);
        break;
    }

    context.log.debug(`Game 2 - Opponent: ${opponent}, me: ${me}, mapped: ${part2Mapped}`);

    part2Score += getChoicePoints(part2Mapped) + getGamePoints(game.compete(opponent, part2Mapped));

  });

  context.log.info(`You thought you achieved a score of ${part1Score}.`);
  context.log.info(`You really want to achieve a score of ${part2Score}.`);
}

type Choices = 'A' | 'B' | 'C';

const enum GameResult {
  Win,
  Loss,
  Draw
}

function getChoicePoints(a: Choices): number {
  switch (a) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
  }
}

function getGamePoints(r: GameResult): number {
  switch (r) {
    case GameResult.Win: return 6;
    case GameResult.Draw: return 3;
    case GameResult.Loss: return 0;
  }
}

class RockPaperScissors {
  private _log: Logger = new Logger(`RockPaperScissors`);
  private _choices: Choice[];
  constructor() {
    const rock = new Choice('A');
    const paper = new Choice('B', rock);
    const scissors = new Choice('C', paper, rock);
    rock.prev = scissors;
    rock.next = paper;
    paper.next = scissors;
    this._choices = [
      rock,
      paper,
      scissors
    ];
  }

  /**
   * 
   * @param a Opponent
   * @param b You
   * @returns 
   */
  public compete(a: Choices, b: Choices): GameResult {
    if (a == b) {
      this._log.verbose(`Draw!`)
      return GameResult.Draw;
    }
    const choice = this._choices.find(c => c.choice == a);
    this._log.debug(`Found choice: ${choice?.choice}`);
    if (choice?.prev?.choice == b) {
      this._log.verbose(`Loss!`);
      return GameResult.Loss;
    }
    this._log.verbose('Win!');
    return GameResult.Win;
  }

  /**
   * Returns the choice that beats `a`
   */
  public getPredator(a: Choices): Choices {
    return this._choices.find(c => c.choice == a)!.next!.choice;
  }

  /**
   * Returns the choice that `a` beats
   */
  public getPrey(a: Choices): Choices {
    return this._choices.find(c => c.choice == a)!.prev!.choice;
  }
}

class Choice {
  constructor(private _choice: Choices, public prev?: Choice, public next?: Choice) {}

  public get choice(): Choices {
    return this._choice;
  }
}
