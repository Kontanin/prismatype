import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import CustomError from '../errors';

const prisma = new PrismaClient();

export const CreateProduct = async (req: Request, res: Response): Promise<Response> => {
  let image = '';
  if (req.files && 'image' in req.files) {
    image = (req.files['image'] as Express.Multer.File[])[0].filename;
  }

  const { productName, description, stock, unitPrice, freeShipping, company, category } = req.body;

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

  return res.status(201).json(product);
};

export const Productlist = async (req: Request, res: Response): Promise<Response> => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  });
  return res.status(200).json({ products, count: products.length });
};

export const EditProduct = async (req: Request, res: Response): Promise<Response> => {
  let image = '';
  if (req.files && 'image' in req.files) {
    image = (req.files['image'] as Express.Multer.File[])[0].filename;
  }

  const { id } = req.params;
  const { productName, description, stock, unitPrice, freeShipping, company, category } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      productName,
      description,
      stock,
      image,
      unitPrice: parseFloat(unitPrice),
      freeShipping,
      company,
      category,
    },
  });

  if (!product) {
    throw new CustomError.NotFoundError('Product not found');
  }

  return res.status(200).json(product);
};

export const DeleteProduct = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const product = await prisma.product.update({
    where: { id, isActive: true },
    data: { isActive: false },
  });

  if (!product) {
    throw new CustomError.NotFoundError('Product not found');
  }

  return res.status(200).json(product);
};

export const ProductById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const product = await prisma.product.findFirst({ where: { id } });

  if (!product) {
    throw new CustomError.NotFoundError('Product not found');
  }

  return res.status(200).json(product);
};

export const Pagination = async (req: Request, res: Response): Promise<Response> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const totalProducts = await prisma.product.count();

  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const totalPages = Math.ceil(totalProducts / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;

  return res.status(200).json({
    totalProducts,
    totalPages,
    currentPage: page,
    pageSize: limit,
    nextPage: nextPage ?? null,
    previousPage: previousPage ?? null,
    products,
  });
};

export const Picture = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await prisma.product.findFirst({ where: { id } });

  if (!product) {
    throw new CustomError.NotFoundError('Product not found');
  }

  const filename = product.image || '';
  const dirPath = path.dirname(path.dirname(__dirname));
  const filePath = path.join(dirPath, 'src', 'public', 'images', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
};
