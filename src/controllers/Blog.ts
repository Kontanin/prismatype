
const CustomError = require('../errors');
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient();
import  { Request, Response } from "express";



const FindBlobId=async (id:string)=>{
  const findUser= await prisma.blob.findFirst(
    {where:{id,isActive:true}}
    )
    return findUser
}




const CreateBlog = async (req: Request, res: Response) => {

  try {
    const { title, username, tag, content } = req.body;
    // Check if a blog with the same title already exists
    const existingBlog = await prisma.blob.findFirst({ where: { title } });
    if (existingBlog) {
      return res.status(400).json({ error: "Blog with the same title already exists" });
    }

    // Assuming you have the user ID associated with this blog entry
    // const userId = req?.user.id; // Replace this with the actual way to fetch user ID
      let userId=req?.user?.id
    if(!userId){
      return res.status(400).json({ error: "user not found" });
    }

    await prisma.blob.create({
      data: {
        userId,
        title,
        tag,
        content,
        username,
        isActive: true,

      },
    });

    return res.status(200).json({MSG:"done create blog"});
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
      id,isActive:true
    }, data: {
      title, tag, content,username
    }

  })



  return res.status(200).send(blob);
};

const DeleteBlog = async (req:Request,  res:Response) => {

    const id = req.params.id;
    if(await !FindBlobId(id)){
      return res.status(400).send({ message: "done found" });
  
    }
    console.log
    const blob =await prisma.blob.update({
      where:{
        id,isActive:true
      }, data: {
        isActive:false
      }
  
    })

    return res.status(200).send({ message:`blob tiele:${blob.title} was deleted` });

};

async function BlogListbyUser(req:Request,  res:Response) {
  const userId = req?.user?.id;
console.log(userId,"userId")
  const blob= await prisma.blob.findMany(
    {where:{userId:userId,isActive:true}}
    )
  return res.status(200).send({"blob lenght":blob.length,"blob":blob});
}

const Blog = async (req:Request,  res:Response) => {
  try {
    console.log(req.params.id)
    const blob = await FindBlobId(req.params.id)
    console.log(blob)
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
