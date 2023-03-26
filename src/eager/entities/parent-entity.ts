import { Column, JoinColumn, OneToOne } from 'typeorm'
import { Entity } from 'typeorm/decorator/entity/Entity'
import { BaseEntity } from '../base-entity'
import { ChildEntity } from './child-entity'

@Entity('parent')
export class ParentEntity extends BaseEntity {
  constructor() {
    super()
  }

  @Column({ type: 'nvarchar' })
  name!: string

  @OneToOne(() => ChildEntity, { nullable: false, eager: true })
  @JoinColumn()
  child!: ChildEntity
}
