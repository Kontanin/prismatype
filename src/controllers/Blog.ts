const express = require('express');
const CustomError = require('../errors');
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient();
import  { Request, Response } from "express";
import { blob } from "stream/consumers";
declare global {
  namespace Express {
    export interface RequestUser {
      user?: any;
    }
  }
}
const FindBlobId=async (id:string)=>{
  const findUser= await prisma.blob.findFirst(
    {where:{id,is_active:true}}
    )
    return findUser
}




const CreateBlog = async (req: Request, res: Response) => {

  const { title, username, tag, content } = req.body;
  console.log(content, title, "con");

  try {
    // Check if a blog with the same title already exists
    const existingBlog = await prisma.blob.findFirst({ where: { title } });
    if (existingBlog) {
      return res.status(400).json({ error: "Blog with the same title already exists" });
    }

    // Assuming you have the user ID associated with this blog entry
    // const userId = req?.user.id; // Replace this with the actual way to fetch user ID
      let userId=req?.user.id
    console.log(userId,"userid")
    // Create a new blog entry including the user field
    const newBlog = await prisma.blob.create({
      data: {
        user_id:userId,
        title,
        tag,
        content,
        username,
        is_active: true,
        User: { connect: { id: userId } } // Use connect to establish the relationship
      }
    })

    // Return the newly created blog entry
    return res.status(200).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const EditBlog = async (req:Request,  res:Response) => {
  const id = req.params.id;

  if(await !FindBlobId(id)){
    return res.status(400).send({ message: "done found" });

  }
  const { title, username, tag, content } = req.body;
  const blob =await prisma.blob.update({
    where:{
      id,is_active:true
    }, data: {
      title, tag, content
    }

  })



  return res.status(200).send(blob);
};

const DeleteBlog = async (req:Request,  res:Response) => {

    const id = req.params.id;
    if(await !FindBlobId(id)){
      return res.status(400).send({ message: "done found" });
  
    }
    const { title, username, tag, content } = req.body;
    const blob =await prisma.blob.update({
      where:{
        id,is_active:true
      }, data: {
        is_active:false
      }
  
    })

    return res.status(200).send({ message: 'deleted' });

};

async function BlogListbyUser(req:Request,  res:Response) {
  const user_id = req.body;
  const blob =await prisma.blob.findMany({
    where:{
      user_id
    }
  })
  return res.status(200).send({"blob lenght":blob.length,"blob":blob});
}

const Blog = async (req:Request,  res:Response) => {
  try {
    const blob =FindBlobId(req.params.id)
    return res.status(200).send(blob);
  } catch (e) {
    return res.status(400).send({ msg: e });
  }
};
module.exports = {
  CreateBlog,
  EditBlog,
  DeleteBlog,
  BlogListbyUser,
  Blog
};
