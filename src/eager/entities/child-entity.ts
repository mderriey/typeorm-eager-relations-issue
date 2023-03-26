import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base-entity'

@Entity('child')
export class ChildEntity extends BaseEntity {
  constructor() {
    super()
  }

  @Column({ type: 'nvarchar' })
  name!: string
}
