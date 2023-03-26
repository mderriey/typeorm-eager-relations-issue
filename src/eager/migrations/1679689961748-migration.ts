import { MigrationInterface, QueryRunner } from 'typeorm'

export class migration1679689961748 implements MigrationInterface {
  name = 'migration1679689961748'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "child" (
                "id" uniqueidentifier NOT NULL,
                "name" nvarchar(255) NOT NULL,
                CONSTRAINT "id_child" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "parent" (
                "id" uniqueidentifier NOT NULL,
                "name" nvarchar(255) NOT NULL,
                "child_id" uniqueidentifier NOT NULL,
                CONSTRAINT "id_parent" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE UNIQUE INDEX "rel_parent_child_id" ON "parent" ("child_id")
            WHERE "child_id" IS NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "parent"
            ADD CONSTRAINT "fk_parent_child_child_id" FOREIGN KEY ("child_id") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "parent" DROP CONSTRAINT "fk_parent_child_child_id"
        `)
    await queryRunner.query(`
            DROP INDEX "rel_parent_child_id" ON "parent"
        `)
    await queryRunner.query(`
            DROP TABLE "parent"
        `)
    await queryRunner.query(`
            DROP TABLE "child"
        `)
  }
}
