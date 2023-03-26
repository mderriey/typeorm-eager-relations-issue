import { eagerDataSource } from './data'
import { ParentEntity } from './entities/parent-entity'
;(async () => {
  try {
    await eagerDataSource.initialize()

    const parents = await eagerDataSource.manager.getRepository(ParentEntity).find()
    console.log(JSON.stringify(parents[0], null, 2))
  } finally {
    if (eagerDataSource.isInitialized) {
      await eagerDataSource.destroy()
    }
  }
})()
