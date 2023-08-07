const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const userModel = require('../models/user');
const ValidationError = require('../errors/validation-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const getCurrnetUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const data = {
        name: user.name,
        email: user.email,
        _id: user._id,
      };
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const logInUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неверные пользователь или пароль.');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        throw new UnauthorizedError('Неверные пользователь или пароль.');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .then((updatedUser) => {
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  logInUser,
  updateUserInfo,
  getCurrnetUser,
};
