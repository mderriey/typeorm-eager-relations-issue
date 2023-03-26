import { randomUUID } from 'crypto'
import { PrimaryColumn } from 'typeorm'

export abstract class BaseEntity {
  @PrimaryColumn({ type: 'uniqueidentifier' })
  id: string = randomUUID()
}
