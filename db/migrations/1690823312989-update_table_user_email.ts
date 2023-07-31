import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUserEmail1690823312989 implements MigrationInterface {
    name = 'UpdateTableUserEmail1690823312989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
