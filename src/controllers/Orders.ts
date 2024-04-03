
const CustomError = require('../errors');

import express, { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { stringify } from "querystring";
import { create } from "domain";
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}



  interface singleOrderItem {
      amount: number;
      name:string;
      price:number;
      product: string;
    }
    interface FakeStripeAPIResponse {
      client_secret: string;
      amount: number;
      StatusPayment: number;
    }
const prisma= new PrismaClient();
// YYMM-000000
const fakeStripeAPI = async ({ amount, currency }:{amount: number; currency: string }) => {
  const client_secret = 'someRandomValue';
  const StatusPayment = 1;
 const findValue=currency
  const pay=amount
  return { client_secret, amount, StatusPayment };
};

//funct
const FindOrder=async (id:string)=>{
  const findUser= await prisma.product.findFirst(
    {where:{id,is_active:true}}
    )
    return findUser
}

interface dbProduct {
  product_name:string;
  unit_price:number|null;
  id:string;
}

const CreateOrder = async (req:Request, res:Response) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
    return res.status(400).send({ msg: 'No cart items provided' });
  }
  if (!tax || shippingFee === 'undefined') {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }
  let OrderItems: any[]  = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct=  await FindOrder(item._id)
    if (!dbProduct) {
      return res.status(400).send({ msg: 'notfullitem' });
    }

    
    const { product_name, unit_price , id }:dbProduct = dbProduct || {};
    if(unit_price){
        OrderItems.push({quantity:item.amount,product_name, unit_price , product_id:id})
        subtotal += item.amount * unit_price;
    }
    
    console.log(product_name, unit_price , id)

  };

  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  let status;
  if (paymentIntent.StatusPayment) {
    status = 'paid';
  } else {
    status = 'pending';
  }
  let payment_intent_id=paymentIntent.client_secret

  

let CreateOrder= await prisma.order.create({
data:{
  is_active:true,
  shippingFee,
  total,
  payment_intent_id,
  status,
  timestamps: new Date(),
  tax,
  user_id:req.user.id

}
})

let newArray = OrderItems.map(obj => ({ ...obj, order_id: CreateOrder.id }));
let ListItem=prisma.order_Item.createMany({
  data:newArray
})
return res.json(CreateOrder).status(200).send({ msg: 'done' }) ;
}

// const UpdateOrder = async (req:Request, res:Response) => {
//   const order_id = req.params.id;
//   const { status, shippingFee, paymentIntentId, OrderItems, total } = req.body;
//     if(await !FindOrder(order_id)){
//       return res.status(400).send({ msg:"not found" });
//     }
//   const find = await prisma.order_Item.update(
//     {where:{id:order_id}
//   ,data:
//     {
//       status: status,
//       shippingFee: shippingFee,
//       OrderItems: OrderItems,
//       total: total,
//     }}
//   )

//   if (find) {
//     res.status(200).send({ msg: find });
//   } else {
//     res.status(400).send({ msg: 'not done' });
//   }
// };

// const DeleteOrder = async (req:Request, res:Response) => {
//   try {
//     const id = req.params.id;

//     await OrderActivation.deleteOne({ _id: id });

//     return res.status(200).send({ message: 'deleted' });
//   } catch (error) {
//     res.status(500).send({ message: error });
//   }
// };

// const Orderlist = async (req:Request, res:Response) => {
//   try {
//     const orders = await OrderActivation.find({});
//     res.status(200).json({ orders, count: orders.length });
//   } catch (e) {
//     res.status(400).json({ msg: e });
//   }
// };
// const OrderDetail = async (req:Request, res:Response) => {
//   const id = req.params.id;
//   try {
//     const orders = await OrderActivation.findById(id);
//     res.status(200).json(orders);
//   } catch (e) {
//     res.status(400).json({ msg: e });
//   }
// };
module.exports = {
  CreateOrder,
  // UpdateOrder,
  // DeleteOrder,
  // Orderlist,
  // OrderDetail,
}
