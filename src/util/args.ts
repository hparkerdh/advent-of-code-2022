import parser from 'yargs-parser';
import { isLogLevelKey, Logger, LogLevel } from './logger';

export type Args = {
  logLevel?: string;
  test: boolean;
};

export function parseArgs(): Args {
  const args = parser(process.argv.slice(2));

  return {
    logLevel: args.logLevel,
    test: !!args.test
  };
}