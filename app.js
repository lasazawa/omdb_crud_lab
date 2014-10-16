var express = require("express");
var request = require("request");
bodyParser = require("body-parser");

var app = express();

app.get('/', function(req, res){
  res.render('index.ejs');
});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));

var favorites = [];
var count = 1;

app.get('/search', function(req, res){

  var searchTerm = req.query.movieTitle;
  var url = "http://www.omdbapi.com/?s=" + searchTerm;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      res.render("results.ejs", {movieList: obj.Search});
    }
  });
});

app.get('/movie/:id', function(req, res) {
    //use movie id to find more info about this film
    var filmId = req.params.id;
    var url = "http://www.omdbapi.com/?i=" + filmId;

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var film = JSON.parse(body);
            res.render("film.ejs", {filmDetails: film});
        }
    });


});
app.get('/favorites', function(req, res) {
    res.render("favorites.ejs", {favoritesList: favorites});
});

app.post('/favorites', function(req, res) {
    var favoritedFilm = {};
    favoritedFilm.title = req.body.movie.title;
    favoritedFilm.count = count;
    count++;
    favorites.push(favoritedFilm);
    console.log(favorites);
    res.render("favorites.ejs", {favoritesList: favorites});
});



app.listen(3333);
