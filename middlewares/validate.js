const { celebrate, Joi } = require('celebrate');

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLoggedInUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/[\w\d\S.\-\\/]+\.[\w\d\S.\\/]+/),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/[\w\d\S.\-\\/]+\.[\w\d\S.\\/]+/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/[\w\d\S.\-\\/]+\.[\w\d\S.\\/]+/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const validatePersonalInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateUser,
  validatePersonalInfo,
  validateMovieId,
  validateMovie,
  validateLoggedInUser,
};
