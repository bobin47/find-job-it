import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableResume1693835555545 implements MigrationInterface {
    name = 'AddTableResume1693835555545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`resume\` (\`id\` int NOT NULL AUTO_INCREMENT, \`linkCv\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`resume\``);
    }

}
