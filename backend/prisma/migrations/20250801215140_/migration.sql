/*
  Warnings:

  - You are about to drop the `_FileInfoToNode` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `nodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_FileInfoToNode" DROP CONSTRAINT "_FileInfoToNode_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FileInfoToNode" DROP CONSTRAINT "_FileInfoToNode_B_fkey";

-- AlterTable
ALTER TABLE "public"."edges" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."nodes" ADD COLUMN     "relatedDocumentsId" TEXT[],
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_FileInfoToNode";

-- AddForeignKey
ALTER TABLE "public"."nodes" ADD CONSTRAINT "nodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edges" ADD CONSTRAINT "edges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
