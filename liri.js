var keys = require("./keys.js");

var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

command_line_parameters(process.argv[2], process.argv[3]);

function command_line_parameters(command, param) {
	switch (command) {
		case "my-tweets" 			: 	my_tweets();
						   				break;
		case "spotify-this-song" 	: 	spotify_this_song(param);
								   		break;
		case "movie-this" 			: 	movie_this(param);
										break;
		case "do-what-it-says"		: 	do_what_it_says();
										break;
		default : break;
	}
}

function my_tweets() {
	var client = new twitter(keys.twitterKeys);
	var params = {
		screen_name: "CBSSunday",
		count: 20
	};
	client.get('statuses/user_timeline', params, 
		function(error, tweets, response) {
  			if (!error) {
  				for(var i=0; i < tweets.length; i++) {
    				console.log(tweets[i].created_at  + "\n" + tweets[i].text + "\n");
    				log(tweets[i].created_at  + "\n" + tweets[i].text + "\n");
    			}
  			}
	});
}

function spotify_this_song(song) {
	if(song == null) song = "The Sign";
	spotify.search({ type : 'track', query: song }, function(error, data) {
    	if ( error ) {
     	   		console.log(error);
     	   		return;
    	}
    	for(var i = 0; i < data.tracks.items.length; i++) {
    		var track = data.tracks.items[i];
			if(track.name.toLowerCase() == song.toLowerCase()){
    			var artists = [];
    			for(var j = 0; j < track.artists.length; j++) {
    					artists.push(track.artists[j].name);
    			}
    			console.log("Artist(s):\t" + artists + "\n"
    				+ "Name:\t\t" + track.name + "\n"
    				+ "Preview:\t" + track.preview_url + "\n"
    				+ "Album:\t\t" + track.album.name + "\n");
    			log("Artist(s):\t" + artists + "\n"
    				+ "Name:\t\t" + track.name + "\n"
    				+ "Preview:\t" + track.preview_url + "\n"
    				+ "Album:\t\t" + track.album.name + "\n");
    		}
    	}
	}); 
}

function movie_this(movie) {
	if(movie == null) movie = 'Mr. Nobody';
	var options = {
		uri: 'http://www.omdbapi.com/?r=json&plot=full&y&tomatoes=true&t=' 
		     + movie,
		json: true 
	};
	request(options, function (error, response, data) {
		if (!error && response.statusCode == 200) {
 	 		console.log("Title:\t\t" + data.Title + "\n"
 	 				+ "Year:\t\t" + data.Year + "\n" 
 	 				+ "IMDB Rating:\t" + data.imdbRating + "\n"
 	 				+ "Country:\t" + data.Country + "\n"
 	 				+ "Language:\t" + data.Language + "\n"
 	 				+ "Plot:\t\t" + data.Plot + "\n"
 	 				+ "Actors:\t\t" + data.Actors + "\n"
 	 				+ "Rotten Tomatoes Rating:\t" + data.tomatoRating + "\n"
 	 				+ "Rotten Tomatoes URL:\t" + data.tomatoURL + "\n");
 	 		log("Title:\t\t" + data.Title + "\n"
 	 				+ "Year:\t\t" + data.Year + "\n" 
 	 				+ "IMDB Rating:\t" + data.imdbRating + "\n"
 	 				+ "Country:\t" + data.Country + "\n"
 	 				+ "Language:\t" + data.Language + "\n"
 	 				+ "Plot:\t\t" + data.Plot + "\n"
 	 				+ "Actors:\t\t" + data.Actors + "\n"
 	 				+ "Rotten Tomatoes Rating:\t" + data.tomatoRating + "\n"
 	 				+ "Rotten Tomatoes URL:\t" + data.tomatoURL + "\n");
		}
 	});
}

function do_what_it_says() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		var parameters = data.split(",");
		var clean = parameters[1].replace(/"/g , " ").trim();
		command_line_parameters(parameters[0],clean);
	});
}

function log(data) {
	fs.appendFile('log.txt', data, function (error) {
  		if(error){
			console.log(error);
		}
	});
}