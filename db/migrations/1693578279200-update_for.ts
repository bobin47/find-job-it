import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFor1693578279200 implements MigrationInterface {
    name = 'UpdateFor1693578279200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`companyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD CONSTRAINT \`FK_e66170573cabd565dab1132727d\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP FOREIGN KEY \`FK_e66170573cabd565dab1132727d\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`companyId\``);
    }

}
