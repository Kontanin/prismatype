import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
// import CustomError from '../errors';

const prisma = new PrismaClient();

export const CreateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let image = '';
  if (req.files && 'image' in req.files) {
    image = (req.files['image'] as Express.Multer.File[])[0].filename;
  }

  const {
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
    return res.status(200).json(product);
  } catch (errors) {
    console.log(errors);
    return res.status(400).json({ msg: errors });
  }
};

export const Productlist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
    });
    return res.status(200).json({ products, count: products.length });
  } catch (errors) {
    return res.status(500).json({ msg: 'Failed to fetch products' });
  }
};

export const EditProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let image = '';
  if (req.files && 'image' in req.files) {
    image = (req.files['image'] as Express.Multer.File[])[0].filename;
  }

  const { id } = req.params;
  const {
    productName,
    description,
    stock,
    unitPrice,
    freeShipping,
    company,
    category,
  } = req.body;

  try {
    const product = await prisma.product.update({
      where: {
        id,
      },
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
      return res.status(400).send({ msg: 'not found' });
    }

    return res.status(200).send({ product });
  } catch (errors) {
    return res.status(500).send({ msg: 'Failed to update product', errors });
  }
};

export const DeleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const product = await prisma.product.update({
      where: {
        id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // if (!product) {
    //   throw new CustomError.BadRequestError('Please provide tax and shipping fee');
    // }

    return res.status(200).json(product);
  } catch (errors) {
    return res.status(500).json({ msg: 'Failed to delete product', errors });
  }
};

export const ProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findFirst({ where: { id } });
    return res.status(200).json(product);
  } catch (errors) {
    return res.status(500).json({ msg: 'Failed to fetch product', errors });
  }
};

export const Pagination = async (
  req: Request,
  res: Response
): Promise<Response> => {
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

export const Picture = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findFirst({ where: { id } });
    const filename = product?.image || '';
    const dirPath = path.dirname(path.dirname(__dirname));
    const filePath = path.join(dirPath, 'src', 'public', 'images', filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('File not found');
      }
    });
  } catch (errors) {
    res.status(500).send('Failed to retrieve image');
  }
};
