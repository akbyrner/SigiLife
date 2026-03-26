/*
  Warnings:

  - You are about to drop the column `fileSize` on the `svg_vectors` table. All the data in the column will be lost.
  - You are about to drop the column `sigilId` on the `svg_vectors` table. All the data in the column will be lost.
  - You are about to drop the column `vectorData` on the `svg_vectors` table. All the data in the column will be lost.
  - Added the required column `file_size` to the `svg_vectors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vector_data` to the `svg_vectors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `svg_vectors` DROP COLUMN `fileSize`,
    DROP COLUMN `sigilId`,
    DROP COLUMN `vectorData`,
    ADD COLUMN `file_size` INTEGER NOT NULL,
    ADD COLUMN `sigil_id` INTEGER NULL,
    ADD COLUMN `vector_data` TEXT NOT NULL;
