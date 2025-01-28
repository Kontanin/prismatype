import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import data from '../MockUpData/data.json';
import { error } from 'console';

const prisma = new PrismaClient();

export interface Message {
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: Date;
  isRead?: boolean;
}
export async function fetchMessages(req: Request, res: Response) {
  console.log('Fetching messages...');
  const { UserId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  console.log(UserId, 'UserId');
  try {
    const skip = (Number(page) - 1) * Number(pageSize); // Calculate the offset for pagination
    const take = Number(pageSize); // Define how many messages to fetch
    const check = await prisma.conversation.findFirst({
      where: {
        OR: [{ UserId: UserId }],
      },
    });
    if (check) {
      const checkCon = await prisma.conversation.findFirst({
        where: {
          OR: [{ id: check.id }],
        },
      });

      if (checkCon) {
        const checkMessage = await prisma.message.findMany({
          where: {
            conId: checkCon.id,
          },
          include: {
            Conversation: {
              select: {
                UserId: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        return res.status(200).json(checkMessage);
      }
    }

    return res.status(400).json({ error: 'no found conId' });
    // ดึงข้อความทั้งหมดที่เกี่ยวข้องกับ admin
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching messages.' });
  }
}

// Create a new message (unchanged)
export async function createCon(Id: String) {
  if (!Id) {
    throw new Error('User ID is required.');
  }
  try {
    if (Id !== undefined) {
      const createCon = await prisma.conversation.create({
        data: {
          UserId: Id as string,
        },
      });
      console.log(createCon, 'createcon');
      return createCon;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
}

// Create a new message (unchanged)
export async function createMessage(req: Request, res: Response) {
  const { content, isRead, customerId, senderId, conId } = req.body;
  console.log('create message');
  // Validate required fields
  if (!customerId || !senderId || !content) {
    console.log('Missing required fields', customerId, senderId, content);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let newConId = conId;

    // Check if `conId` is provided and valid
    if (newConId || senderId) {
      console.log('Checking if provided conId is valid...');
      try {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            OR: [
              { id: newConId }, // Match by provided conId
              { UserId: customerId }, // Match by customerId
            ],
          },
        });
        if (existingConversation) {
          newConId = existingConversation.id;
          const checkUseradmin = await prisma.user.findFirst({
            where: {
              id: customerId,
            },
          });
          if (checkUseradmin) {
            if (checkUseradmin.role === 'admin') {
              return res.status(400).json({
                error: 'bad required please not usea adminId as customerId ',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error finding conversation by conId:', error);
        return res
          .status(500)
          .json({ error: 'Failed to find conversation', details: error });
      }
    }

    // // If no valid `conId`, create a new conversation
    if (!newConId) {
      console.log('Creating new conversation...');
      try {
        const newConversation = await prisma.conversation.create({
          data: {
            UserId: customerId,
          },
        });
        newConId = newConversation.id;
      } catch (error) {
        console.error('Error creating conversation:', error);
        ``;
        return res
          .status(500)
          .json({ error: 'Failed to create conversation', details: error });
      }
    }

    //   console.log('Resolved conversation ID:', newConId);

    // Create the message
    try {
      const message = await prisma.message.create({
        data: {
          content: content as string,
          senderId: senderId as string,
          isRead: isRead ?? false, // Default to false if not provided
          conId: newConId as string,
        },
      });
      return res.status(200).json({ msg: message });
    } catch (error) {
      console.error('Error creating message:', error);
      return res
        .status(500)
        .json({ error: 'Failed to create message', details: error });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res
      .status(500)
      .json({ error: 'Unexpected error occurred', details: error });
  }
}
export async function chatHistory(req: Request, res: Response) {
  console.log('Fetching chat history...');
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize); // Calculate the offset for pagination
  const take = Number(pageSize); // Define how many messages to fetch
  try {
    // Fetch distinct chats involving the admin
    const topMessages = await prisma.message.findMany({
      distinct: ['conId'], // Specify the field to get distinct results
      take: 10, // Limit the results to the top 10
      orderBy: {
        createdAt: 'desc', // Sort by the latest created messages
      },
      select: {
        id: true,
        content: true,
        conId: true,
        createdAt: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        Conversation: {
          select: {
            UserId: true,
          },
        },
      },
    });

    res.status(200).json(topMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Could not fetch chats' });
  }
}
