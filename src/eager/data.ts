import { DataSource } from 'typeorm'
import { commonDataSourceOptions } from '../data-options'

export const eagerDataSource = new DataSource({
  ...commonDataSourceOptions,
  database: 'typeorm-eager-issue',
  entities: ['src/eager/entities/*{.ts,.js}'],
  migrations: ['src/eager/migrations/*.ts'],
})
