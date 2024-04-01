-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "address" TEXT,
    "subdistrict" TEXT,
    "country" TEXT,
    "zipcode" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blob" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT,
    "content" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userUser_id" TEXT,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "description" TEXT,
    "stock" INTEGER,
    "unit_price" INTEGER,
    "image" TEXT,
    "freeShipping" BOOLEAN,
    "company" TEXT,
    "category" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "shippingFee" BOOLEAN,
    "total" INTEGER NOT NULL,
    "payment_intent_id" TEXT,
    "status" TEXT NOT NULL,
    "timestamps" TIMESTAMP(3) NOT NULL,
    "tax" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_Item" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "Order_Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Blob_title_key" ON "Blob"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_name_key" ON "Product"("product_name");

-- AddForeignKey
ALTER TABLE "Blob" ADD CONSTRAINT "Blob_userUser_id_fkey" FOREIGN KEY ("userUser_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
