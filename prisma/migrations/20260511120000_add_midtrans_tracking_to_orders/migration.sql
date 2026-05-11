ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "midtransOrderId" TEXT,
ADD COLUMN IF NOT EXISTS "midtransTransactionId" TEXT,
ADD COLUMN IF NOT EXISTS "midtransQrString" TEXT,
ADD COLUMN IF NOT EXISTS "midtransQrCodeUrl" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Order_midtransOrderId_key" ON "Order"("midtransOrderId");
