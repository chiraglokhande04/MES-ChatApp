const express = require('express');
const router = express.Router();
const {
  createUser,
  login,
  logout,
  verifyEmail,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  updateSocketStatus
} = require('../controllers/userController');

const parser = require('../middlewares/multer');



router.post('/register', createUser);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify', verifyEmail);
router.get('/:id', getUserProfile);
router.put('/profile/:id', parser.single('profilePic'), updateUserProfile);
router.get('/', getAllUsers);
router.put('/socket/:id', updateSocketStatus);

module.exports = router;
