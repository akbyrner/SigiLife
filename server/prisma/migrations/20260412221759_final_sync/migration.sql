-- -- DropForeignKey
-- ALTER TABLE `sigils` DROP FOREIGN KEY `sigils_userId_fkey`;

-- -- DropIndex
-- DROP INDEX `sigils_userId_name_key` ON `sigils`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `color_theme` VARCHAR(50) NOT NULL DEFAULT 'cyber';

-- CreateTable
CREATE TABLE `Follow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `followerId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Follow_followerId_followingId_key`(`followerId`, `followingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
