const router = require('express').Router();
const { validateMovieId, validateMovie } = require('../middlewares/validate');
const moviesController = require('../controllers/movies');

router.get('/movies', moviesController.getMovies);
router.post('/movies', validateMovie, moviesController.addMovie);
router.delete('/movies/:movieId', validateMovieId, moviesController.deleteMovie);

module.exports = router;
