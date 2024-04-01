import express from "express";
const { authentication:UserAu, authorizePermissions:OrderAuPer }=require( '../middlewares/auth')
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

router.delete('/delete/:id',OrderAuPer,OrderAuPer('admin'), DeleteUser);

router.patch('/update/:id',OrderAuPer, UpdateUser);

router.patch('/pass/:id',OrderAuPer ,UpdatePass);

router.get('/information/:id', Information);

module.exports = router;
