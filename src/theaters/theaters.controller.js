
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { whereToWatch } = require("../movies/movies.service");
const services = require("./theaters.service");

async function list(req, res) {
  let { movieId } = req.params;

  //checks if there is a movieId
  if (movieId !== undefined) {
    res.json({ data: await whereToWatch(movieId) });
  } else {
    const theaters = await services.list();

    //adds the movies to each theater
    const theatersWithMovies = theaters.map(async (theater) => {
      return { ...theater, movies: await services.moviesList(theater) };
    });
    const result = await Promise.all(theatersWithMovies);

    res.json({ data: result });
  }
}


module.exports = {
  list: asyncErrorBoundary(list)
}