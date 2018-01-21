//importing the keys
var keys = require("./key.js");

var Twitter = require('twitter');

var spotify = require('node-spotify-api');

var req = require("request");

var fs = require("fs");

function getTweets(){
	var client = new Twitter(keys.twitterKeys);;

	//defining the screen name to fetch tweets
	var params = {screen_name: 'BTCTN'};

	//main the get call to get the latest 20 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("");
	  	console.log("");
	  	console.log("***********TWEETS STARTS*************");
	  	console.log("");
	  	writeToFile("\n");
	  	writeToFile("\n");
	  	writeToFile("\n***********TWEETS STARTS*************");
	  	writeToFile("");	  	
	    tweets.forEach(function(tweet){
	    	console.log(tweet.text);
	    	console.log("------------------------------------------------------");
	    	console.log("");
	    	writeToFile("\n" + tweet.text);
	    	writeToFile("\n------------------------------------------------------");
	    	writeToFile("\n");	    	
	    });
	   	console.log("***********TWEETS ENDS*************");
	   	writeToFile("\n***********TWEETS ENDS*************");
	  }else{
	  	console.log(error);
	  	writeToFile("\n" + error);
	  }
	});	
}

function getMusic(query){
	var sp = new spotify(keys.spotifyKeys);

	sp.search({type: 'track', query: query}, function(error, data){
		if(!error){
			console.log("");
			console.log("");
			console.log("**************SONG INFO STARTS****************");
			writeToFile("\n");
			writeToFile("\n");
			writeToFile("\n**************SONG INFO STARTS****************");			
			for(key in data.tracks.items){
				console.log("Album Name - ", data.tracks.items[key].album.name);
				console.log("Spotify URL - ", data.tracks.items[key].external_urls.spotify);
				console.log("Track - ", data.tracks.items[key].name);
				writeToFile("\n" + "Album Name - ", data.tracks.items[key].album.name);
				writeToFile("\n" + "Spotify URL - ", data.tracks.items[key].external_urls.spotify);
				writeToFile("\n" + "Track - ", data.tracks.items[key].name);				
				for(k in data.tracks.items[key].artists){
					console.log("Artists - " + data.tracks.items[key].artists[k].name);
					writeToFile("\n" + "Artists - " + data.tracks.items[key].artists[k].name);
				}
				console.log("----------------");
				console.log("");
				console.log("\n----------------");
				console.log("\n");				
			}

			console.log("**************SONG INFO ENDS****************");
			console.log("");
			writeToFile("\n**************SONG INFO ENDS****************");
			writeToFile("\n");			
		}else{
			console.log(error);
			writeToFile("\n" + error);
		}
	});
}

function getMovie(movieName){
	// var req = 
	console.log(movieName);
	movieName = movieName.split(' ').join('%20');

	var omdbURL = "http://www.omdbapi.com/?apikey=f04e3b4c&t=";

	var finalURL = omdbURL + movieName;

	req(finalURL, function(error, response, body){
		if(error){
			console.log("An Error Occured");
		}else if(!error && response.statusCode === 200){
			var movieJSON = JSON.parse(body);
			var rottenTomatoRating;
			movieJSON.Ratings.forEach(function(rating){
				// console.log(rating);
				if(rating.Source.toUpperCase()==="ROTTEN TOMATOES")
					rottenTomatoRating = rating.Value;
			});
			console.log("");
			console.log("");
			console.log("*************MOVIE DETAILS STARTS*************");
			console.log("Title: " + movieJSON.Title);
			console.log("* Title of the movie: " + movieJSON.Title);
			console.log("* Year the movie came out: " + movieJSON.Year);   
			console.log("* IMDB Rating of the movie." + movieJSON.imdbRating);
			console.log("* Rotten Tomatoes Rating of the movie: " + rottenTomatoRating);
			console.log("* Country where the movie was produced: " + movieJSON.Country);
			console.log("* Language of the movie: " + movieJSON.Language);
			console.log("* Plot of the movie: " + movieJSON.Plot);
			console.log("* Actors in the movie: " + movieJSON.Actors);
			console.log("*************MOVIE DETAILS ENDS*************");
		}
	});	
}

function processFile(){
	//read file
	fs.readFile("random.txt", "utf-8", function(error, data){

		if(!error){
			// console.log(data);
			var lineContents = data.split("\n");
			lineContents.forEach(function(line){
				var lineContent = line.split(",");
				var inputCmd = String(lineContent[0]).trim();
				if(inputCmd.valueOf().toUpperCase()=="MY-TWEETS"){
					getTweets();
				}else if(inputCmd.valueOf().toUpperCase()=="MOVIE-THIS"){
					var movieName;
					if(lineContent.length>1){
						movieName = String(lineContent[1]);
						getMovie(movieName);
					}else{
						getMovie("Mr. Nobody");
					}
				}else if(inputCmd.valueOf().toUpperCase()=="SPOTIFY-THIS-SONG"){
					var songName;
					if(lineContent.length>1){
						songName = String(lineContent[1]);
						getMusic(songName);
					}else{
						getMusic("The Sign");
					}					
				}
			});
			// console.log(data.split("\n"));
		}else{
			console.log("Error Occured while reading file");
		}
		
	});
}

function writeToFile(data){
	fs.appendFile("./log.txt", data, function(err){
		if(err){
			console.log(err);
			return;
		}
	});	
}

var userInput = process.argv[2];

if(!userInput){
	console.log("Pease provide your choices: " + "\n" + "1. My-Tweets"
				+ "\n" + "2. Spotify-This-Song <Song Name> (Default - The Sign, if not song name provided)"
				+ "\n" + "3. Movide-This <Movie Name> (Default - Mr. Nobody, if no movie name provided)");
}else if(userInput.toUpperCase()==="MY-TWEETS"){
	getTweets();
}else if(userInput.toUpperCase()=="SPOTIFY-THIS-SONG"){
	var query;
	if(process.argv.length<=3){
		query = "The Sign";
	}
	for(var i=3; i<process.argv.length; i++){
		if(query)
			query = query + " " + process.argv[i];
		else
			query = process.argv[i];
	}
	if(query)
		getMusic(query);
}else if(userInput.toUpperCase()==="MOVIE-THIS"){
	var query;
	if(process.argv.length<=3){
		query = "Mr. Nobody";
	}
	for(var i=3; i<process.argv.length; i++){
		if(query)
			query = query + " " + process.argv[i];
		else
			query = process.argv[i];
	}
	if(query){
		getMovie(query);
	}
}else if(userInput.toUpperCase()==="DO-WHAT-IT-SAYS"){
	// console.log("Open the file and read the command");
	processFile();
}else{
	console.log("Pease provide your choices: " + "\n" + "1. My-Tweets"
				+ "\n" + "2. Spotify-This-Song <Song Name> (Default - The Sign, if not song name provided)"
				+ "\n" + "3. Movide-This <Movie Name> (Default - Mr. Nobody, if no movie name provided)");
}

