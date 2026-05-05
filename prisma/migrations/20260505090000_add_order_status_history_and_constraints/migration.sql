UPDATE "Order"
SET "status" = 'sorting'
WHERE "status" IN ('pending', 'PENDING') OR "status" IS NULL OR "status" = '';

UPDATE "Order"
SET "status" = lower("status")
WHERE "status" <> lower("status");

UPDATE "Order"
SET "status" = 'completed'
WHERE "status" = 'COMPLETED';

ALTER TABLE "Order"
ALTER COLUMN "status" SET DEFAULT 'sorting';

ALTER TABLE "Customer"
ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "services" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "payment" TEXT NOT NULL DEFAULT 'cash',
ADD COLUMN IF NOT EXISTS "itemCount" INTEGER,
ADD COLUMN IF NOT EXISTS "deliveryDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "isExpress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "subtotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "expressFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "total" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "note" TEXT,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OrderStatusHistory_orderId_createdAt_idx"
ON "OrderStatusHistory"("orderId", "createdAt");

ALTER TABLE "OrderStatusHistory"
DROP CONSTRAINT IF EXISTS "OrderStatusHistory_orderId_fkey";

ALTER TABLE "OrderStatusHistory"
ADD CONSTRAINT "OrderStatusHistory_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Order"
DROP CONSTRAINT IF EXISTS "Order_status_allowed";

ALTER TABLE "Order"
ADD CONSTRAINT "Order_status_allowed"
CHECK ("status" IN ('sorting', 'washing', 'ironing', 'ready', 'completed', 'cancelled'));

ALTER TABLE "Order"
DROP CONSTRAINT IF EXISTS "Order_payment_allowed";

ALTER TABLE "Order"
ADD CONSTRAINT "Order_payment_allowed"
CHECK ("payment" IN ('cash', 'qris'));

ALTER TABLE "Order"
DROP CONSTRAINT IF EXISTS "Order_paymentStatus_allowed";

ALTER TABLE "Order"
ADD CONSTRAINT "Order_paymentStatus_allowed"
CHECK ("paymentStatus" IN ('unpaid', 'pending', 'paid', 'failed', 'expired'));

ALTER TABLE "OrderStatusHistory"
DROP CONSTRAINT IF EXISTS "OrderStatusHistory_fromStatus_allowed";

ALTER TABLE "OrderStatusHistory"
ADD CONSTRAINT "OrderStatusHistory_fromStatus_allowed"
CHECK ("fromStatus" IS NULL OR "fromStatus" IN ('sorting', 'washing', 'ironing', 'ready', 'completed', 'cancelled'));

ALTER TABLE "OrderStatusHistory"
DROP CONSTRAINT IF EXISTS "OrderStatusHistory_toStatus_allowed";

ALTER TABLE "OrderStatusHistory"
ADD CONSTRAINT "OrderStatusHistory_toStatus_allowed"
CHECK ("toStatus" IN ('sorting', 'washing', 'ironing', 'ready', 'completed', 'cancelled'));
