const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { logInUser, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUser, validateLoggedInUser } = require('../middlewares/validate');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validateLoggedInUser, logInUser);
router.post('/signup', validateUser, createUser);

router.use(auth);

router.use(usersRouter);
router.use(moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден.'));
});

module.exports = router;
