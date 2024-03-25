import express from "express";
const { authentication, authorizePermissions } = require('../middlewares/auth');
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

router.delete('/delete/:id',authentication,authorizePermissions('admin'), DeleteUser);

router.patch('/update/:id',authentication, UpdateUser);

router.patch('/pass/:id',authentication ,UpdatePass);

router.get('/information/:id', Information);

module.exports = router;
