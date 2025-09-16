-- CreateTable
CREATE TABLE "public"."stage_order_overrides" (
    "id" TEXT NOT NULL,
    "organizationId" VARCHAR(100),
    "stage" VARCHAR(100) NOT NULL,
    "weight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stage_order_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stage_order_overrides_organizationId_stage_key" ON "public"."stage_order_overrides"("organizationId", "stage");
