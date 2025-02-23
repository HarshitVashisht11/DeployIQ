/*
  Warnings:

  - Added the required column `apiKey` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiUrl` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "apiUrl" TEXT NOT NULL;
