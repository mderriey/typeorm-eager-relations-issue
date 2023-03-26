/* eslint-disable no-console */
import { Logger, LoggerOptions, QueryRunner } from 'typeorm'
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions'
import { SnakeNamingStrategy } from './snake-naming-strategy'

class LoggerForTypeOrm implements Logger {
  constructor(private options: LoggerOptions) {}

  private shouldLog(logType: 'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration') {
    return this.options === true || this.options === 'all' || (Array.isArray(this.options) && this.options.includes(logType))
  }

  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner) {
    if (!this.shouldLog(level)) return
    console[level === 'log' ? 'info' : level](message)
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    if (!this.shouldLog('migration')) return
    console.info('db migration', { message })
  }

  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    if (!this.shouldLog('query')) return
    console.debug('db query', { query, parameters })
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    if (!this.shouldLog('error')) return
    console.error('db query error', { query, parameters, error })
  }

  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    if (!this.shouldLog('query')) return
    console.warn('db query slow', { query, parameters, time })
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    if (!this.shouldLog('schema')) return
    console.info('db schema build', { message })
  }
}

export const commonDataSourceOptions: SqlServerConnectionOptions = {
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'sa',
  password: '7o}R~=XA1jmz!-aHQ^pA',
  synchronize: false,
  logger: new LoggerForTypeOrm('all'),
  migrationsTransactionMode: 'each',
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    options: {
      trustServerCertificate: true,
    },
  },
}
