import { relationsDataSource } from './data'
import { ParentEntity } from './entities/parent-entity'
;(async () => {
  try {
    await relationsDataSource.initialize()

    const parents = await relationsDataSource.manager.getRepository(ParentEntity).find({
      relations: {
        child: true,
      },
    })

    console.log(JSON.stringify(parents[0], null, 2))
  } finally {
    if (relationsDataSource.isInitialized) {
      await relationsDataSource.destroy()
    }
  }
})()
