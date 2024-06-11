const CustomError = require('../errors');
``;
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express, { Request, Response } from 'express';
const path = require('path');

const CreateProduct = async (req: Request, res: Response) => {
  let image = '';
  if (req.files && 'image' in req.files) {
    image = req.files['image'][0].filename;
  }

  let {
    id,
    productName,
    description,
    stock,
    unitPrice,
    freeShipping,
    company,
    category,
  } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        productName,
        isActive: true,
        description,
        stock,
        unitPrice: parseFloat(unitPrice),
        image,
        freeShipping,
        company,
        category,
      },
    });
    return res.json(product).status(200);
  } catch (errors) {
    console.log(errors);
    return res.json({ msg: errors }).status(400);
  }
};

const Productlist = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
  });

  res.status(200).json({ products, count: products.length });
};

const EditProduct = async (req: Request, res: Response) => {
  let image = '';
  if (req.files && 'image' in req.files) {
    image = req.files['image'][0].filename;
  }
  const id = req.params.id;
  let {
    productName,
    description,
    stock,
    status,
    unitPrice,
    freeShipping,
    company,
    category,
  } = req.body;

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      productName,
      description,
      stock,
      image,
      unitPrice,
      freeShipping,
      company,
      category,
    },
  });

  if (!product) {
    return res.status(400).send({ msg: 'not found' });
  }
  return res.status(200).send({ product });
};

const DeleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await prisma.product.update({
    where: {
      id,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  if (!product) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  return res.status(200).json(product);
};

const ProductById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await prisma.product.findFirst({ where: { id } });
  return res.status(200).json(product);
};

const Pagination = async (req: Request, res: Response) => {
  try {
    // Extract page and limit from query parameters, with default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Calculate the total number of products
    const totalProducts = await prisma.product.count();

    // Fetch paginated products
    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Optional: add sorting by creation date
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    // Determine next and previous page numbers
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    // Return paginated products along with pagination metadata
    return res.status(200).json({
      totalProducts,
      totalPages,
      currentPage: page,
      pageSize: limit,
      nextPage: nextPage ?? null,
      previousPage: previousPage ?? null,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};




const Picture = async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await prisma.product.findFirst({ where: { id } });
  const filename = product?.image;
  const dirPath = path.dirname(path.dirname(__dirname));

  const filePath = path.join(dirPath, 'src', 'public', 'images', filename);
  console.log(filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
};

module.exports = {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  Productlist,
  ProductById,
  Pagination,
  Picture,
};
