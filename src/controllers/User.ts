//const UserActivation = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient();

import express, { Request, Response } from "express";
//done check unique


const FindUser=async (id:string)=>{
  const findUser= await prisma.user.findFirst(
    {where:{id,is_active:true}}
    )
    return findUser
}


const Register = async (req:Request, res:Response) => {
  console.log(req.body,"req")
  try {
    // filter data
    const {
      email,
      password,
      firstname,
      lastname,
      address,
      subdistrict,
      country,
      zipcode,
      username
    } = req.body;
    
    if (!(email && password)) return res.status(400).send({});

    const existUser = await prisma.user.findFirst({ where: { email: email } });

    if (existUser) {
      return res.status(400).json({ message: 'Email already exists in the server' });
    }
    
    // encrypt password
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const obj={
        email,
        username,
        role: 'customer',
        firstname,
        lastname,
        address,
        country,
        subdistrict,
        zipcode,
        password: encryptedPassword,
        is_active: true,
      }
    await prisma.user.create({data:{   email,
      username,
      role: 'customer',
      firstname,
      lastname,
      address,
      country,
      subdistrict,
      zipcode,
      password: encryptedPassword,
      is_active: true,}});

    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const Login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) return res.status(400).send({});
    const user = await prisma.user.findFirst({where:{ email }});
    if (!(user && bcrypt.compareSync(password, user.password))) {
      throw new CustomError.BadRequestError(
      'wrong'
      );
    }
    const token = jwt.sign(
      {
        id: user?.id,
        role: user?.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '30d',
      }
    );

  const data = {
    role: user?.role,
    id: user?.id,
    token,
  };
  console.log(data.role,"role",user?.role,user?.is_active)
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    throw new CustomError.BadRequestError(String(error));
  }
};

// done
const DeleteUser = async (req:Request, res:Response) => {
  
  const id=req.params.id
  const user=await FindUser(id)
  if(!user){
    return res.status(400).send({ message: "not found" });
  }

  try{

    await prisma.user.update({
      where:{id,is_active:true},
        data:{
          is_active: false
        },
        }
    );
    return res.status(200).send({ message: user?.username+'deleted' });
  }catch(e){
    return res.status(400).send({ message: e });
  }

};

// ยังไม่เสร็จ
const UpdateUser = async (req:Request, res:Response) => {
  const id = req.params.id;
  if(await !FindUser(id)){
    return res.status(400).send({ message: "not found" });
  }
  let {
    email,
    firstname,
    lastname,
    address,
    subdistrict,
    country ,
    zipcode,
    username
  } = req.body;
  const update = await prisma.user.update({
    where:{id,is_active:true},data:{
      email,
      firstname,
        lastname,
        address,
        subdistrict,
        country,
        zipcode,
        username
    }
  }
  );
  if (!update) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  return res.json(update).status(200);
};
interface Find1 {
  email?: string | null | undefined;
  username?: string | null | undefined;      
  role?: string | null | undefined;    
  is_active?: boolean | null | undefined;
  firstname?: string | null | undefined; 
  lastname?: string | null | undefined;
  address?: string | null | undefined;  
  subdistrict?: string | null | undefined;
  country?: string | null | undefined; 
  zipcode?: string | number | null | undefined; // Update to accept number as well
}
const Information = async (req: Request, res: Response) => {
  const id = req.params.id;
  let find = await FindUser(id);

  if (!find) {
    throw new CustomError.BadRequestError('User not found');
  }

  // Check if find is not null before destructure
  if (!find) {
    return res.status(400).send({ message: "not found" });
  }
  console.log(find,"test")
  const { email, username, role, is_active, firstname, lastname, address, subdistrict, country, zipcode }: Find1 = find;
  return res.json({
    email,
    username,
    role,
    is_active,
    firstname,
    lastname,
    address,
    subdistrict,
    country,
    zipcode
  });
};


const UpdatePass = async (req:Request, res:Response) => {
  let { email, password,Newpassword } = req.body;
  
  const id = req.params.id;
  const user= await FindUser(id)
  console.log(user)

  if(password==Newpassword){
    return res.status(400).send({ message: "same password" });
  }
  if(! user){
    return res.status(400).send({ message: "not found" });
  }
  if (!(user && bcrypt.compareSync(password, user.password))) {
    throw new CustomError.BadRequestError(
    'wrong pass'
    );
  }

  const encryptedPassword = bcrypt.hashSync(Newpassword, 10);
  await prisma.user.update({
    where:{id},data:{password:encryptedPassword
    }
  }
  );
  return res.status(200).send({ message: "done change pass" });
};





const UpdateRole = async (req:Request, res:Response) => {
  const id = req.params.id;
  let {
    role
  } = req.body;


  const update = await prisma.user.update({
    where:{id,is_active:true},data:{
  role
    }
  }
  );
  if (!update) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  return res.json(update).status(200);
};

module.exports = {
  Register,
  UpdateUser,
  Login,
  DeleteUser,
  Information,
  UpdatePass,
  UpdateRole,
};
