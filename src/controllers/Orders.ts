
const CustomError = require('../errors');

import express, { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { stringify } from "querystring";
import { create } from "domain";
import { cp } from "fs";
import { Console } from "console";




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
    {where:{id,isActive:true}}
    )
    return findUser
}

interface Product {
  productName:string;
  unitPrice:number|null;
  id:string;
}













const CreateOrder = async (req:Request, res:Response) => {

  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(
      'plese provide cart items'
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

    const dbProduct=  await prisma.product.findFirst(
      {where:{id:item.id,isActive:true}}
      )
    console.log(dbProduct,"dbProduct")
    if (!dbProduct) {
      return res.status(400).send({ msg: 'notfullitem' });
    }
    else{
      if(dbProduct.stock==0 || dbProduct.stock==null || dbProduct.stock<item.amount){
        return res.status(400).send({ msg: `nothave ${dbProduct.productName } item` })
      }else if (dbProduct.stock-item.amount<0){
        // send mail to admin here
        return res.status(400).send({ msg: `product  ${dbProduct.productName } not enough` })

      }else{
        prisma.product.update({
          where: {
            id: dbProduct.id, // replace with the id of the product you want to update
          },
          data: {
            stock: dbProduct.stock-item.amount,
          },
        });
      }
    }
    const { productName, unitPrice , id }:Product = dbProduct || {};
    console.log(dbProduct,"dbProduct")
        if(unitPrice){
  
        OrderItems.push({quantity:item.amount, unitPrice , productId:id,isActive:true})
        subtotal += item.amount * unitPrice;
    }else{
      return res.status(400).send({ msg: 'have problem with system plese conntect admin' });
      // send mail to admin here pricce pruduct not found
    }

}
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
  let paymentIntentId=paymentIntent.client_secret

let userId=req?.user?.id
console.log(userId,"userId")
let CreateOrder= await prisma.order.create({
    data:{
      isActive:true,
      shippingFee,
      total,
      paymentIntentId,
      status,
      timestamps: new Date(),
      tax,
      userId:userId||""
  }
})

let newArray = OrderItems.map((obj) => {
  obj["orderId"]=CreateOrder.id
return obj
});
console.log(newArray,"newArray")
let ListItem= await prisma.orderItem.createMany({
data:  newArray
})
console.log(ListItem,"ListItem")
return res.status(200).send({ msg: 'done create order' }) ;
}



const UpdateOrder = async (req:Request, res:Response) => {
  
  const order_id = req.params.OrderId;
  console.log(order_id,"order_id")
  const {cartItems} = req.body;

  if (order_id) {
    if(await !FindOrder(order_id)){
      return res.status(400).send({ msg:"not found" });
    }}
  const find = 1
 let newTotal=0
  for (const Items of cartItems) {
    console.log(Items,"Items")
    const id=Items.id
    const quantityNew=Items?.quantity
    const productIdNew=Items?.productId
    if(!quantityNew||!productIdNew){
      return res.status(400).send({ msg: 'notfullitem' });
    }
    else if (!id&&quantityNew&&productIdNew){
      await prisma.orderItem.create({
        data:{
          quantity:quantityNew,
          unitPrice:1,
          "productId":productIdNew,
          orderId:order_id,
          isActive:true
        }
      })

      
    }
    else{

      
      const dbOrder=  await prisma.orderItem.update(
        {where:{id,isActive:true},data:{quantity:quantityNew},include:{product:true}}
      )
      if(!dbOrder){
        return res.status(400).send({ msg: 'not found item last' });
      } 
      else{
        const {unitPrice}=dbOrder.product
        if(unitPrice){
          newTotal+=quantityNew*unitPrice
        }
        else{
          throw new CustomError.BadRequestError("not found price product")
        }
  
      }


    }

  }
  const orders = await prisma.order.update({
    where:{id:order_id,isActive:true},data:{
      "total":newTotal}
    ,include:{orderItems:true}
    })
  // cal new tota and update
    res.status(200).send(orders );

};


const UpdateStatusOrder = async (req:Request, res:Response) => {
  const order_id = req.params.id;
  const { status,product_id } = req.body;
    if(await !FindOrder(order_id)){
      return res.status(400).send({ msg:"not found" });
    }
  const find = await prisma.order.update(
    {where:{id:order_id,isActive:true}
  ,data:
    {status}}
  )

  if (find) {
    res.status(200).send({ msg: find });
  } else {
    res.status(400).send({ msg: 'not done' });
  }
};




const UpdatePayMentOrder = async (req:Request, res:Response) => {
  const order_id = req.params.id;
  const {  paymentIntentId } = req.body;
    if(await !FindOrder(order_id)){
      return res.status(400).send({ msg:"not found" });
    }
  const find = await prisma.order.update(
    {where:{id:order_id,isActive:true}
  ,data:
    {paymentIntentId}}
  )

  if (find) {
    res.status(200).send({ msg: find });
  } else {
    res.status(400).send({ msg: 'not done' });
  }
};
const DeleteOrder = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;

    const delete1 =await prisma.order.update({
      where:{id,isActive:true},
      data:{
        isActive:false
      }
    })

    return res.status(200).send({ message: 'deleted' });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const OrderlistbyUser = async (req:Request, res:Response) => {
  try {
    // let order_id=req.params.order_id
    let userId1=req?.user?.id
    console.log(userId1,"userId1")

    const orders = await prisma.order.findMany({
      select:{orderItems:true,shippingFee:true,total:true,paymentIntentId:true,status:true,tax:true,timestamps:true,userId:true},
      where:{userId:userId1}
    })
    console.log(orders,"orders")

    res.status(200).json({ orders, count: orders.length });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e });

  }
};


module.exports = {
  CreateOrder,

UpdateOrder,
 // DeleteOrder,
 OrderlistbyUser,
  UpdateStatusOrder,
}
