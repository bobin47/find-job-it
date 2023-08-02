import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldRefreshtokeTableUser1690968630928 implements MigrationInterface {
    name = 'UpdateFieldRefreshtokeTableUser1690968630928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
