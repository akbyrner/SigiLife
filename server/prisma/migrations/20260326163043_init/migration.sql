-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` INTEGER NOT NULL DEFAULT 0,
    `theme` INTEGER NOT NULL DEFAULT 1,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sigil` (
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

    UNIQUE INDEX `Sigil_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SigilGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sigilId` INTEGER NOT NULL,
    `groupMember` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SvgVector` (
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
ALTER TABLE `Sigil` ADD CONSTRAINT `Sigil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SigilGroup` ADD CONSTRAINT `SigilGroup_sigilId_fkey` FOREIGN KEY (`sigilId`) REFERENCES `Sigil`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
