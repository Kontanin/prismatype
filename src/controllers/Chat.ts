import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import data from '../MockUpData/data.json';

const prisma = new PrismaClient();

export interface Message {
  content: string;
  senderId: string;
  recipientId: string;
  timestamp?: Date;
  isRead?: boolean;
}

// Fetch messages between two users and count unread messages
export async function fetchMessages(req: Request, res: Response) {
  const { userIdA, userIdB } = req.body;

  try {
    // Fetch messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userIdA,
            recipientId: userIdB,
          },
          {
            senderId: userIdB,
            recipientId: userIdA,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc', // Order messages chronologically
      },
      include: {
        sender: true,
        recipient: true,
      },
    });

    // Count unread messages sent by userIdB to userIdA
    const unreadCount = await prisma.message.count({
      where: {
        senderId: userIdB,
        recipientId: userIdA,
        isRead: false,
      },
    });
    //  return res.status(200).json({data:data})
    return res.status(200).json({
      messages,
      unreadCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching messages.' });
  }
}

// Fetch all messages for a user (unchanged)
export async function fetchAllMessages(req: Request, res: Response) {
  const { userId } = req.params; // Assuming you pass the userId in the URL as a parameter

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            recipientId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc', // Order messages chronologically
      },
      include: {
        sender: true,
        recipient: true,
      },
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching all messages.' });
  }
}

// Create a new message (unchanged)
export async function createMessage(req: Request, res: Response) {
  const { content, senderId, recipientId, isRead } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        content: content,
        senderId: senderId,
        recipientId: recipientId,
        isRead: isRead ?? false, // Default to false if not provided
      },
      include: {
        sender: true,
        recipient: true,
      },
    });
    // console.log(content,userId);
    // res.status(200).json({"msg": "success"});

    return res.status(201).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while creating the message.' });
  }
}
