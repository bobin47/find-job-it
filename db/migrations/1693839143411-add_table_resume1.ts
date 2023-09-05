import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableResume11693839143411 implements MigrationInterface {
    name = 'AddTableResume11693839143411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`resume\` (\`id\` int NOT NULL AUTO_INCREMENT, \`linkCv\` varchar(255) NOT NULL, \`jobId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`resume\` ADD CONSTRAINT \`FK_139738d723c0814afccaa17e50e\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resume\` DROP FOREIGN KEY \`FK_139738d723c0814afccaa17e50e\``);
        await queryRunner.query(`DROP TABLE \`resume\``);
    }

}
