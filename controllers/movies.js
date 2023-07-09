const movieModel = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  movieModel.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
  movieModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  movieModel.findOne({ movieId: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((deletedMovie) => {
      if (deletedMovie.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Карточку может удалить только ее автор.');
      }
      movieModel.findOneAndRemove({ movieId: deletedMovie.movieId })
        .then(res.status(200).send({ message: 'Фильм удален из сохраненных.' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
