
export enum LogLevel {
  error = 0,
  warn = 1,
  info = 2,
  verbose = 3,
  debug = 4,
  silly = 5
};

export function isLogLevelKey(level: any): level is keyof typeof LogLevel {
  return Object.keys(LogLevel).includes(level);
}

export class Logger {
  static defaultLevel: LogLevel = LogLevel.info;
  static loggers: {[name: string]: Logger} = {};

  static setLevel(name: string, level: LogLevel) {
    this.loggers[name].level = level;
  }

  constructor(name: string, public level: LogLevel = Logger.defaultLevel) {
    Logger.loggers[name] = this;
  }

  private _log(level: LogLevel, message: string): void {
    if (level <= this.level) {
      console.log(`${LogLevel[level]} : ${message}`);
    }
  }

  public error = this._log.bind(this, LogLevel.error);
  public warn = this._log.bind(this, LogLevel.warn);
  public info = this._log.bind(this, LogLevel.info);
  public verbose = this._log.bind(this, LogLevel.verbose);
  public debug = this._log.bind(this, LogLevel.debug);
  public silly = this._log.bind(this, LogLevel.silly);
}
