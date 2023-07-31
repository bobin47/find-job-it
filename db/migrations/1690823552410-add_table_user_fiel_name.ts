import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableUserFielName1690823552410 implements MigrationInterface {
  name = 'AddTableUserFielName1690823552410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`name\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`name\``);
  }
}
