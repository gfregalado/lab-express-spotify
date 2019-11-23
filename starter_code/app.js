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
// connects partial views to fill the layout
hbs.registerPartials(path.join(__dirname, "/views/partials"));

// setting the spotify-api goes here:
let clientId = 'b7f166ce91a04c77a17be089c1655d02',
  clientSecret = 'e24445801730472fae96ed9d108b4262';
// Create the api object with the credentials
let spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
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

// artists route
app.get('/artists', (req, res) => {
  let searchedArtist = req.query.search;
  spotifyApi.searchArtists(searchedArtist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render('artists.hbs', {
        //will become this. in the partials views as set in /artists route
        artistsObj: data.body.artists.items
      })

    })
    .catch(err => {
      //console.log("The error while searching artists occurred: ", err);
    });
})

// Albums route
app.get('/albums/:artistId', (req, res, next) => {
  let searchedAlbum = req.params.artistId;
  spotifyApi.getArtistAlbums(searchedAlbum)
    .then(data => {
      console.log('Artist albums', data.body.items)
      res.render('albums.hbs', {
        albumObj: data.body.items
      })
    })
    .catch(err => {
      console.log("The error while searching them album occurred: ", err);
    });
})

// Tracks route
app.get('/tracks/:trackId', (req, res, next) => {
  let searchedTracks = req.params.trackId;
  console.log(searchedTracks)
  spotifyApi.getAlbumTracks(searchedTracks)
    .then(data => {
      console.log('Album Tracks', data.body.items)
      res.render('tracks.hbs', {
        tracksObj: data.body.items
      })
    })
    .catch(err => {
      console.log("The error while searching them tracks occurred: ", err);
    });
})

app.listen(3001, () =>
  console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊')
);
