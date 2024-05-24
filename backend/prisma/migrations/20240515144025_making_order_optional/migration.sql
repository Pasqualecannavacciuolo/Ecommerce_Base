-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_order_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "order_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
