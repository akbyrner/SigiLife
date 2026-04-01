/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `sigils` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `sigils_name_key` ON `sigils`;

-- CreateIndex
CREATE UNIQUE INDEX `sigils_userId_name_key` ON `sigils`(`userId`, `name`);
