import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldAvtarUserTable1691053328539
  implements MigrationInterface
{
  name = 'UpdateFieldAvtarUserTable1691053328539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
  }
}
