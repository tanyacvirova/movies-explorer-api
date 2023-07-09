const router = require('express').Router();
const usersController = require('../controllers/users');
const { validatePersonalInfo } = require('../middlewares/validate');

router.get('/users/me', usersController.getCurrnetUser);
router.patch('/users/me', validatePersonalInfo, usersController.updateUserInfo);

module.exports = router;
