import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CustomError from '../errors';

const prisma = new PrismaClient();

const FindBlobId = async (id: string) => {
  const findBlob = await prisma.blob.findFirst({
    where: { id, isActive: true },
  });
  return findBlob;
};

export const CreateBlog = async (req: Request, res: Response) => {
  try {
    const { title, username, tag, content } = req.body;

    const existingBlog = await prisma.blob.findFirst({ where: { title } });
    if (existingBlog) {
      throw new CustomError.BadRequestError(
        'Blog with the same title already exists'
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError.UnauthenticatedError('User not authenticated');
    }

    const newBlog = await prisma.blob.create({
      data: {
        userId,
        title,
        tag,
        content,
        username,
        isActive: true,
      },
    });

    return res
      .status(201)
      .json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const EditBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, username, tag, content } = req.body;

  try {
    const existingBlog = await FindBlobId(id);
    if (!existingBlog) {
      throw new CustomError.NotFoundError('Blog not found');
    }

    const updatedBlog = await prisma.blob.update({
      where: { id, isActive: true },
      data: {
        title,
        tag,
        content,
        username,
      },
    });

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const DeleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingBlog = await FindBlobId(id);
    if (!existingBlog) {
      throw new CustomError.NotFoundError('Blog not found');
    }

    const deletedBlog = await prisma.blob.update({
      where: { id, isActive: true },
      data: { isActive: false },
    });

    return res
      .status(200)
      .json({ message: `Blog with title "${deletedBlog.title}" was deleted` });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const BlogListbyUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    if (!userId) {
      throw new CustomError.UnauthenticatedError('User not authenticated');
    }

    const blogs = await prisma.blob.findMany({
      where: { userId, isActive: true },
    });

    return res.status(200).json({ count: blogs.length, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const Blog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const blog = await FindBlobId(id);
    if (!blog) {
      throw new CustomError.NotFoundError('Blog not found');
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  CreateBlog,
  EditBlog,
  DeleteBlog,
  BlogListbyUser,
  Blog,
};
