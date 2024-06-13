import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError } from '../errors';

const prisma = new PrismaClient();

const FindUser = async (id: string) => {
  const findUser = await prisma.user.findFirst({
    where: { id, isActive: true },
  });
  return findUser;
};

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstname, lastname, address, subdistrict, country, zipcode } = req.body;

    if (!(email && password)) {
      throw new BadRequestError('Email and password are required');
    }

    const existUser = await prisma.user.findFirst({ where: { email } });

    if (existUser) {
      throw new BadRequestError('Email already exists in the server');
    }

    const encryptedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      email,
      role: 'customer',
      firstname,
      lastname,
      address,
      country,
      subdistrict,
      zipcode,
      password: encryptedPassword,
      isActive: true,
    };
    await prisma.user.create({ data: newUser });

    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      throw new BadRequestError('Invalid email or password');
    }
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthenticatedError('Invalid email or password');
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY!,
      { expiresIn: '30d' }
    );

    const data = { role: user.role, id: user.id, token };
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await FindUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    return res.status(200).send({ message: `${user.email} was deleted` });
  } catch (e) {
    return res.status(400).send({ message: String(e) });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await FindUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { email, firstname, lastname, address, subdistrict, country, zipcode } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, firstname, lastname, address, subdistrict, country, zipcode },
    });
    return res.json(updatedUser).status(200);
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const Information = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await FindUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { email, role, isActive, firstname, lastname, address, subdistrict, country, zipcode } = user;
  return res.json({ email, role, isActive, firstname, lastname, address, subdistrict, country, zipcode });
};

export const UpdatePass = async (req: Request, res: Response) => {
  const { email, password, Newpassword } = req.body;
  const id = req.params.id;
  const user = await FindUser(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (password === Newpassword) {
    throw new BadRequestError('New password cannot be the same as the old password');
  }
  if (!Newpassword) {
    throw new BadRequestError('New password is required');
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw new UnauthenticatedError('Wrong password');
  }

  const encryptedPassword = bcrypt.hashSync(Newpassword, 10);
  await prisma.user.update({
    where: { id },
    data: { password: encryptedPassword },
  });
  return res.status(200).send({ message: 'Password updated successfully' });
};

export const UpdateRole = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return res.json(updatedUser).status(200);
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const ValidateToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new UnauthenticatedError('Invalid token');
    }
    res.json({ valid: true, user: decoded });
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error:', error);
    return res.status(500).json({ message: 'Failed to decode token' });
  }
};
