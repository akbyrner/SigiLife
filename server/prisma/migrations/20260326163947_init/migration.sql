/*
  Warnings:

  - You are about to drop the `Sigil` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SigilGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SvgVector` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Sigil` DROP FOREIGN KEY `Sigil_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SigilGroup` DROP FOREIGN KEY `SigilGroup_sigilId_fkey`;

-- DropTable
DROP TABLE `Sigil`;

-- DropTable
DROP TABLE `SigilGroup`;

-- DropTable
DROP TABLE `SvgVector`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` INTEGER NOT NULL DEFAULT 0,
    `theme` INTEGER NOT NULL DEFAULT 1,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sigils` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `userId` INTEGER NOT NULL,
    `intention` TEXT NULL,
    `canvasData` LONGTEXT NULL,
    `imageData` LONGTEXT NULL,
    `isCharged` BOOLEAN NOT NULL DEFAULT false,
    `locationName` VARCHAR(200) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sigils_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sigil_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sigilId` INTEGER NOT NULL,
    `groupMember` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `svg_vectors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sigilId` INTEGER NULL,
    `filename` TEXT NOT NULL,
    `vectorData` TEXT NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sigils` ADD CONSTRAINT `sigils_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sigil_groups` ADD CONSTRAINT `sigil_groups_sigilId_fkey` FOREIGN KEY (`sigilId`) REFERENCES `sigils`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
