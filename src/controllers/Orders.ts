import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CustomError from '../errors';

const prisma = new PrismaClient();

const FindOrder = async (id: string) => {
  const findOrder = await prisma.order.findFirst({
    where: { id, isActive: true },
  });
  if (!findOrder) {
    throw new CustomError.NotFoundError('Order not found');
  }
  return findOrder;
};

interface Product {
  productName: string;
  unitPrice: number | null;
  id: string;
}

interface FakeStripeAPIResponse {
  client_secret: string;
  amount: number;
  StatusPayment: number;
}

const fakeStripeAPI = async ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}): Promise<FakeStripeAPIResponse> => {
  const client_secret = 'someRandomValue';
  const StatusPayment = 1;
  return { client_secret, amount, StatusPayment };
};

export const CreateOrder = async (req: Request, res: Response) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('Please provide cart items');
  }
  if (!tax || shippingFee === undefined) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  let orderItems: any[] = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await prisma.product.findFirst({
      where: { id: item.id, isActive: true },
    });
    if (!dbProduct) {
      throw new CustomError.BadRequestError(`Product not found`);
    } else if (
      dbProduct.stock == 0 ||
      dbProduct.stock == null ||
      dbProduct.stock < item.amount
    ) {
      throw new CustomError.BadRequestError(
        `Product ${dbProduct.productName} not available`
      );
    } else if (dbProduct.stock - item.amount < 0) {
      throw new CustomError.BadRequestError(
        `Product ${dbProduct.productName} stock not enough`
      );
    } else {
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: { stock: dbProduct.stock - item.amount },
      });
    }

    const { productName, unitPrice, id }: Product = dbProduct;
    if (unitPrice) {
      orderItems.push({
        quantity: item.amount,
        unitPrice,
        productId: id,
        isActive: true,
      });
      subtotal += item.amount * unitPrice;
    } else {
      throw new CustomError.BadRequestError(
        'System error, please contact admin'
      );
    }
  }

  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: 'usd' });
  const status = paymentIntent.StatusPayment ? 'paid' : 'pending';
  const paymentIntentId = paymentIntent.client_secret;
  const userId = req.user?.id || '';

  const createOrder = await prisma.order.create({
    data: {
      isActive: true,
      shippingFee,
      total,
      paymentIntentId,
      status,
      timestamps: new Date(),
      tax,
      userId,
    },
  });

  const orderItemsWithOrderId = orderItems.map((item) => ({
    ...item,
    orderId: createOrder.id,
  }));
  await prisma.orderItem.createMany({ data: orderItemsWithOrderId });

  return res.status(200).send({ msg: 'Order created successfully' });
};

export const UpdateOrder = async (req: Request, res: Response) => {
  const orderId = req.params.OrderId;
  const { cartItems } = req.body;

  await FindOrder(orderId);

  let newTotal = 0;

  for (const item of cartItems) {
    const { id, quantity, productId } = item;
    if (!quantity || !productId) {
      throw new CustomError.BadRequestError('Incomplete item information');
    }

    if (!id && quantity && productId) {
      await prisma.orderItem.create({
        data: { quantity, unitPrice: 1, productId, orderId, isActive: true },
      });
    } else {
      const dbOrder = await prisma.orderItem.update({
        where: { id, isActive: true },
        data: { quantity },
        include: { product: true },
      });
      if (!dbOrder) {
        throw new CustomError.NotFoundError('Order item not found');
      } else {
        const { unitPrice } = dbOrder.product;
        if (unitPrice) {
          newTotal += quantity * unitPrice;
        } else {
          throw new CustomError.BadRequestError('Product price not found');
        }
      }
    }
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId, isActive: true },
    data: { total: newTotal },
    include: { orderItems: true },
  });
  res.status(200).send(updatedOrder);
};

export const UpdateStatusOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { status } = req.body;

  await FindOrder(orderId);

  const updatedOrder = await prisma.order.update({
    where: { id: orderId, isActive: true },
    data: { status },
  });
  res.status(200).send(updatedOrder);
};

export const UpdatePaymentOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { paymentIntentId } = req.body;

  await FindOrder(orderId);

  const updatedOrder = await prisma.order.update({
    where: { id: orderId, isActive: true },
    data: { paymentIntentId },
  });
  res.status(200).send(updatedOrder);
};

export const DeleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id;

  await FindOrder(id);

  const deletedOrder = await prisma.order.update({
    where: { id, isActive: true },
    data: { isActive: false },
  });
  res.status(200).send({ message: 'Order deleted successfully' });
};

export const OrderlistbyUser = async (req: Request, res: Response) => {
  const userId = req.user?.id || '';

  const orders = await prisma.order.findMany({
    where: { userId },
    select: {
      orderItems: true,
      shippingFee: true,
      total: true,
      paymentIntentId: true,
      status: true,
      tax: true,
      timestamps: true,
      userId: true,
    },
  });
  res.status(200).json({ orders, count: orders.length });
};

export default {
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
  OrderlistbyUser,
  UpdateStatusOrder,
  UpdatePaymentOrder,
};
