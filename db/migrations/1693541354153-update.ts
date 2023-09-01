import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1693541354153 implements MigrationInterface {
    name = 'Update1693541354153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`company\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`job\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`job\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` CHANGE \`updated_at\` \`updated_at\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` CHANGE \`created_at\` \`created_at\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`company\` CHANGE \`updated_at\` \`updated_at\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`company\` CHANGE \`created_at\` \`created_at\` datetime(0) NOT NULL`);
    }

}
