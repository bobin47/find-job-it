import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTowTable1693535345868 implements MigrationInterface {
    name = 'AddTowTable1693535345868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`company\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`logo\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`job\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`skill\` varchar(255) NOT NULL, \`salary\` varchar(255) NOT NULL, \`level\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`startDate\` datetime NOT NULL, \`endDate\` datetime NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`job\``);
        await queryRunner.query(`DROP TABLE \`company\``);
    }

}
