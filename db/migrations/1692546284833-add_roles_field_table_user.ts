import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesFieldTableUser1692546284833 implements MigrationInterface {
    name = 'AddRolesFieldTableUser1692546284833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`roles\` varchar(255) NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roles\``);
    }

}
