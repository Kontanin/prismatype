import express, { Request, Response } from 'express';
const {
  authentication: UserAu,
  authorizePermissions: UserAuPer,
} = require('../middlewares/auth');
const {
  Register,
  Login,
  DeleteUser,
  UpdateUser,
  Information,
  UpdatePass,
  ValidateToken
} = require('../controllers/User');

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);

router.delete('/delete/:id', UserAu, UserAuPer('admin'), DeleteUser);

router.patch('/update/:id', UserAu, UpdateUser);

router.patch('/pass/:id', UserAu, UpdatePass);

router.get('/information/:id', Information);


router.post('/validate-token',  ValidateToken )
module.exports = router;
