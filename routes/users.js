const router = require('express').Router();
const {
  validId,
  validAuthName,
  validUserInfo,
  userAvatarValid,
} = require('../middlewares/joiValidation');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validId('userId'), getUser);
router.post('/', validAuthName, createUser);
router.patch('/me', validUserInfo, updateUser);
router.patch('/me/avatar', userAvatarValid, updateAvatar);

module.exports = router;
