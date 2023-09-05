import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableResumeUpdate1693835750080 implements MigrationInterface {
    name = 'AddTableResumeUpdate1693835750080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resume\` ADD \`jobId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`resume\` ADD CONSTRAINT \`FK_139738d723c0814afccaa17e50e\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resume\` DROP FOREIGN KEY \`FK_139738d723c0814afccaa17e50e\``);
        await queryRunner.query(`ALTER TABLE \`resume\` DROP COLUMN \`jobId\``);
    }

}
