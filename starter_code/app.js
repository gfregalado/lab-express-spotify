require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path')
const app = express();



//viewengine

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, "views/partials"));

// setting the spotify-api goes here:

const clientId = '555d994836b64552b2930488bb3f77ee';
const clientSecret = '05fd7eaa407c42d4b0d50240da6df9c6';


const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/artists', (req, res) => {
  let searchedArtist = req.query.search;
  spotifyApi.searchArtists(searchedArtist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists.hbs', {
        artistsObj: data.body.artists.items
      })

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

  //res.render("artists.hbs")
})



app.listen(3001, () =>
  console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊')
);
