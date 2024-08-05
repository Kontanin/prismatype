import { Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET_KEY, REFRESH_SECRET_KEY } from '../index';
import CustomError from '../errors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

let refreshTokens: string[] = [];

export async function jwtVerify(
  token: string,
  secret: string
): Promise<JwtPayload | string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as JwtPayload);
    });
  });
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new CustomError.BadRequestError('Invalid email or password');
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError.BadRequestError('Invalid email or password');
  }
  console.log(user, SECRET_KEY, 'user', REFRESH_SECRET_KEY);
  const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    REFRESH_SECRET_KEY,
    { expiresIn: '7d' }
  );

  refreshTokens.push(refreshToken);

  return res
    .status(200)
    .json({ id: user.id, role: user.role, accessToken, refreshToken });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: 'Refresh token is not valid' });
  }

  try {
    const decoded = await jwtVerify(token, REFRESH_SECRET_KEY);
    const newAccessToken = jwt.sign(
      { id: (decoded as JwtPayload).id },
      SECRET_KEY,
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign(
      { id: (decoded as JwtPayload).id },
      REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    refreshTokens = refreshTokens.filter((t) => t !== token);
    refreshTokens.push(newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ message: 'Refresh token is not valid' });
  }
};

export const protectedRoute = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const user = await jwtVerify(token, SECRET_KEY);
    res.json({ message: 'This is a protected route', user });
  } catch (err) {
    res.sendStatus(403);
  }
};
