import { DataSource } from 'typeorm'
import { commonDataSourceOptions } from '../src/data-options'
import { eagerDataSource } from '../src/eager/data'
import { ChildEntity } from '../src/eager/entities/child-entity'
import { ParentEntity } from '../src/eager/entities/parent-entity'

async function setUpDatabase() {
  const saMasterDataSource = new DataSource({ ...commonDataSourceOptions, database: 'master' })
  await saMasterDataSource.initialize()
  await saMasterDataSource.query(`
    IF DB_ID('typeorm-eager-issue') IS NULL
    BEGIN
      CREATE DATABASE [typeorm-eager-issue]
    END`)
  await saMasterDataSource.destroy()
}

async function runMigrations() {
  await eagerDataSource.initialize()
  await eagerDataSource.runMigrations()
  await eagerDataSource.destroy()
}

async function seedData() {
  await eagerDataSource.initialize()

  const child = new ChildEntity()
  child.name = 'Child entity'
  await eagerDataSource.manager.getRepository(ChildEntity).save(child)

  const parent = new ParentEntity()
  parent.name = 'Parent entity'
  parent.child = child
  await eagerDataSource.manager.getRepository(ParentEntity).save(parent)

  await eagerDataSource.destroy()
}

;(async () => {
  await setUpDatabase()
  await runMigrations()
  await seedData()
})().catch((error) => console.log(error))
