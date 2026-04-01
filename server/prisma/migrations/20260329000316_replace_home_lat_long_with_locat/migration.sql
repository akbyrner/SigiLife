/*
  Warnings:

  - You are about to drop the column `homeLatitude` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `homeLongitude` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `homeLatitude`,
    DROP COLUMN `homeLongitude`,
    ADD COLUMN `homeLocation` VARCHAR(500) NULL;
