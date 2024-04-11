import express, { Request, Response } from "express";
const { authentication:UserAu, authorizePermissions:UserAuPer }=require( '../middlewares/auth')
const {
  Register,
  Login,
  DeleteUser,
  UpdateUser,
  Information,
  UpdatePass,
  UpdateRole,
} = require('../controllers/User');

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);

router.delete('/delete/:id',UserAu, DeleteUser);

router.patch('/update/:id',UserAu, UpdateUser);  

//problem here ,UserAuPer(['admin', 'manager'])

router.patch('/pass/:id',UserAu ,UpdatePass);

router.get('/information/:id', Information);

module.exports= router;
