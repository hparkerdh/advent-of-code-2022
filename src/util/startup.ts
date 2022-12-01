import { Args, parseArgs } from "./args";
import { readData } from "./data";
import { isLogLevelKey, Logger, LogLevel } from "./logger";

export class Startup {
  private _args: Args;

  public log: Logger;
  
  constructor(private _day: string) {
    this._args = parseArgs();
    if (isLogLevelKey(this._args.logLevel)) {
      Logger.defaultLevel = LogLevel[this._args.logLevel];
    }

    this.log = new Logger(_day);
  }

  public readData(cb: (line: string) => void): Promise<void> {
    return readData(this._day, this._args.test, cb);
  }
}
