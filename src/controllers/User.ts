import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import CustomError from '../errors';
import { SECRET_KEY } from '../index';
const prisma = new PrismaClient();

const FindUser = async (id: string) => {
  const findUser = await prisma.user.findFirst({
    where: { id, isActive: true },
  });
  return findUser;
};

export const Register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstname,
    lastname,
    address,
    subdistrict,
    country,
    zipcode,
  } = req.body;

  if (!(email && password)) {
    throw new CustomError.BadRequestError('Email and password are required');
  }

  const existUser = await prisma.user.findFirst({ where: { email } });

  if (existUser) {
    throw new CustomError.BadRequestError('Email already exists in the server');
  }

  const encryptedPassword = bcrypt.hashSync(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: encryptedPassword,
      role: 'customer',
      firstname,
      lastname,
      address,
      subdistrict,
      country,
      zipcode,
      isActive: true,
    },
  });

  return res
    .status(201)
    .json({ message: 'User created successfully', user: newUser });
};



export const DeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await FindUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  return res.status(200).json({ message: `${user.email} was deleted` });
};

export const UpdateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, firstname, lastname, address, subdistrict, country, zipcode } =
    req.body;

  const user = await FindUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      email,
      firstname,
      lastname,
      address,
      subdistrict,
      country,
      zipcode,
    },
  });

  return res.status(200).json(updatedUser);
};

export const Information = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await FindUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  const {
    email,
    role,
    isActive,
    firstname,
    lastname,
    address,
    subdistrict,
    country,
    zipcode,
  } = user;
  return res.status(200).json({
    email,
    role,
    isActive,
    firstname,
    lastname,
    address,
    subdistrict,
    country,
    zipcode,
  });
};

export const UpdatePass = async (req: Request, res: Response) => {
  const { email, password, newPassword } = req.body;
  const { id } = req.params;

  const user = await FindUser(id);
  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new CustomError.BadRequestError('Incorrect current password');
  }

  if (password === newPassword) {
    throw new CustomError.BadRequestError(
      'New password cannot be the same as the old password'
    );
  }

  const encryptedPassword = bcrypt.hashSync(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: { password: encryptedPassword },
  });

  return res.status(200).json({ message: 'Password updated successfully' });
};

export const ValidateToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new CustomError.BadRequestError('Token is required');
  }

  const decoded = jwt.decode(token);
  if (!decoded) {
    throw new CustomError.UnauthenticatedError('Invalid token');
  }

  return res.status(200).json({ valid: true, user: decoded });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.send('Logged out successfully');
};

export const getTokenIssueDate = (token: string): Date | null => {
  let n = SECRET_KEY || '';
  try {
    const decoded = jwt.verify(token, n) as { iat: number };
    if (decoded && decoded.iat) {
      const issueDate = new Date(decoded.iat * 1000);
      return issueDate;
    }
    return null;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
