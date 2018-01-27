require('dotenv').config();
var request = require('request');
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js')

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var params = {
    screen_name: 'RiedlerG',
    count: 20,
};

var action = process.argv[2];
var value = process.argv[3];

switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThis(value);
        break;
    case 'movie-this':
        movieThis(value);
        break;
    case 'do-what-it-says':
        random();
        break;
};

// my-tweets function
function myTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && response.statusCode == 200) {
            console.log('LATEST 20 TWEETS\n------------------------')
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log([i + 1] + '. ' + tweets[i].text
                + '\nCreated on: ' + tweets[i].created_at
                + '\n------------------------'), function(err) {
                    if (err) throw err;
                }
            }
        }
        fs.appendFile('log.txt', ('------------------------\n' 
        + Date() 
        + '\nCOMMAND ENTERED\n' 
        + action))
    })
};// end of my-tweets function

// spotify-this-song function
function spotifyThis(value) {
    
    if (value == null) {
        value = 'The Sign';
    };

    spotify.search({ 
        type: 'track', 
        query: 'track:' + '%22' + value + '%22'
    
    }, function(err, data) {
         if (err) {
         return console.log('Error occurred: ' + err);
        }
    console.log('------------------------' 
    + '\nArtist: ' + data.tracks.items[0].artists[0].name 
    + '\nTrack Name: ' + data.tracks.items[0].name
    + '\nPreview Link: ' + data.tracks.items[0].preview_url
    + '\nAlbum: ' + data.tracks.items[0].album.name
    + '\n------------------------');
    fs.appendFile('log.txt', ('------------------------\n' 
        + Date() 
        + '\nCOMMAND ENTERED\n' 
        + action 
        + '\nVALUE ENTERED\n'
        + value
        + '\nDATA RETURNED\n' 
        + '\nArtist: ' + data.tracks.items[0].artists[0].name 
        + '\nTrack Name: ' + data.tracks.items[0].name
        + '\nPreview Link: ' + data.tracks.items[0].preview_url
        + '\nAlbum: ' + data.tracks.items[0].album.name 
        + '\n------------------------'), function(err) {
            if (err) throw err;
        });  
    })
    
}; // end of spotify-this-song function

// movieThis function
function movieThis(value) {
    if (value == null) {
        value = 'Mr. Nobody';
    }
    request('http://www.omdbapi.com/?apikey=' + keys.omdb.apikey + '&t=' + value + '&tomatoes=true', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
        console.log('TITLE: ' + data.Title
            + '\nYEAR: ' + data.Year
            + '\nIMDB RATING: ' + data.imdbRating
            + '\nROTTEN TOMATOES: ' + data.Ratings[1].Value
            + '\nCOUNTRY: ' + data.Country
            + '\nLANGUAGE: ' + data.Language
            + '\nPLOT: ' + data.Plot
            + '\nACTORS: ' + data.Actors
            + '\n------------------------');
        fs.appendFile('log.txt', ('------------------------\n' 
            + Date() 
            + '\nCOMMAND ENTERED\n' 
            + action 
            + '\nVALUE ENTERED\n'
            + value
            + '\nDATA RETURNED\n' 
            + 'TITLE: ' + data.Title
            + '\nYEAR: ' + data.Year
            + '\nIMDB RATING: ' + data.imdbRating
            + '\nROTTEN TOMATOES: ' + data.Ratings[1].Value
            + '\nCOUNTRY: ' + data.Country
            + '\nLANGUAGE: ' + data.Language
            + '\nPLOT: ' + data.Plot
            + '\nACTORS: ' + data.Actors 
            + '\n------------------------'), function(err) {
                if (err) throw err;
            });
        }
    });
} //end movieThis function

// do-what-it-says function
function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                spotifyThis(dataArr[1]);
            }
            if (dataArr[0] === 'movie-this') {
                movieThis(dataArr[1]);
            }
        }
        fs.appendFile('log.txt', ('------------------------\n' 
        + Date() 
        + '\nCOMMAND ENTERED\n' 
        + action 
        + '\nDATA\n' 
        + data + '\n------------------------'), function(err) {
            if (err) throw err;
        });  
    });

    
} // end of do-what-it-says function
