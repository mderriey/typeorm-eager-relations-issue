import { DataSource } from 'typeorm'
import { commonDataSourceOptions } from '../data-options'

export const relationsDataSource = new DataSource({
  ...commonDataSourceOptions,
  database: 'typeorm-eager-issue',
  entities: ['src/relations/entities/*{.ts,.js}'],
})
