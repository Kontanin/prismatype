
const CustomError = require('../errors');``

import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient();
import express, { Request, Response } from "express";


const CreateProduct = async (req:Request, res:Response) => {
  let {
    id  ,        
    product_name,      
    description ,
    stock      ,
    unit_price    ,
    image       ,
    freeShipping ,
    company     ,
    category    
  } = req.body;
  try{
    const product = await prisma.product.create(
      {
        data:{        
          product_name,      
          is_active :true  ,
          description ,
          stock      ,
          unit_price    ,
          image       ,
          freeShipping ,
          company     ,
          category    ,
          }
        }
      )
    return res.json(product).status(200);
  }catch(errors){
    console.log(errors)
    return res.json({msg:errors}).status(400);
  }
};


const Productlist = async (req:Request, res:Response) => {
  const products= await prisma.product.findMany({
    where:{
      is_active:true
    }
  })

  res.status(200).json({ products, count: products.length });
};

const EditProduct = async (req:Request, res:Response) => {
  const id = req.params.id;
  let {
    product_name,
    description,
    stock,
    status,
    unit_price,
    freeShipping,
    company,
    category,
  } = req.body;

  const product = await prisma.product.update({
    where:{
      id
    },data:{
      product_name,
      description,
      stock,
      unit_price,
      freeShipping,
      company,
      category,
    }
  })

  if (!product) {
    return res.status(400).send({ msg: 'not found' });
  }
  return res.status(200).send({ product });
};

const DeleteProduct = async (req:Request, res:Response) => {
  const id = req.params.id;

  const product = await prisma.product.update({
    where:{
      id,is_active:true
    },data:{
      is_active:false
    }
  })

  if (!product) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  return res.status(200).json(product);
};



const ProductById = async (req:Request, res:Response) => {
  const id = req.params.id;
  const product = await prisma.product.findFirst({where:{id}});
  return res.status(200).json(product);
};



// const uploadSingleImage = async (req:Request, res:Response) => {
//   let file = req.file;
//   if (!file) {
//     console.log('pass');
//     throw new CustomError.BadRequestError(
//       'Please provide tax and shipping fee'
//     );
//   } else {
//     res.status(200).send({
//       file,
//     });
//   }
// };

module.exports = {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  Productlist,
  ProductById,
  //uploadSingleImage,
};
