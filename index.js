// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // Enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function GetContext(contexts) {
    const context = contexts.filter(context => {
        console.log("debug flag: " + context.name);
        return context.name === 'sessiondata';
    });
    return context;

  }
  
  // Function to load parameter values
  function LoadParameterValues(context) {
    if ( context.length === 0 ) {
      console.error("No session data context found.");
      return { anime: 0, romanticcomedy: 0, sitcom: 0, western: 0};
    }

    let anime = parseInt(context[0].parameters.anime);
    let romanticcomedy = parseInt(context[0].parameters.romanticcomedy);
    let sitcom = parseInt(context[0].parameters.sitcom);
    let western = parseInt(context[0].parameters.western);

    return { anime, romanticcomedy, sitcom, western };
  }

  // Function to log scores
  function LogScores(spiel, scores) {
    console.log("spiel: " + spiel);
    console.log("anime: " + scores.anime);
    console.log("romantic comedy: " + scores.romanticcomedy);
    console.log("sitcom: " + scores.sitcom);
    console.log("western: " + scores.western);
  }

  // Welcome Function
  function Welcome(agent) {
    // https://github.com/dialogflow/dialogflow-fulfillment-nodejs/issues/71
    console.log("Agent contexts: ", agent.contexts);

    agent.contexts.forEach(context => {
      agent.setContext({
        name: context.name,
        lifespan: '0',
        parameters: {}
      });
      console.log(`cleared the context: ${context.name}`);
    });

    agent.add("What's up! I'm ShowBro, your go-to movie rec guru. Let's get watching!");
    agent.add("Are you ready to find your next movie?");

    // Facebook Responses
    agent.add({
        imageUrl: "https://i.imgur.com/RX1s3pw.jpeg",
        platform: "FACEBOOK" 
    });
    agent.add({
        quickReplies: {
            title: "Choose an option below to get started!",
            quickReplies: ["Something special", "Any recommendation"]
        },
        platform: "FACEBOOK"

    // Telegram Responses
    });
    agent.add({
        imageUrl: "https://i.imgur.com/RX1s3pw.jpeg",
        platform: "TELEGRAM" 
    });
    agent.add({
        quickReplies: {
            title: "Choose an option below to get started!",
            quickReplies: ["Something special", "Any recommendation"]
        },
        platform: "TELEGRAM"
    });
}

  // Get started intent
  function GetStarted(agent) {
    const query = agent.query.toLowerCase();
    let spiel = null;

    console.log("query: ", query);

    if (query.includes('special')) {
        spiel = `Amazing! You're looking for something extraordinary! Let's get started then. 🎬`;
    }
    else {
        spiel = `Great choice! Let's find something awesome for you. 🍿`;
    }

    agent.add(spiel);
    agent.add(`What is your name?`);

    console.log("spiel: ", spiel); 
}


  // Function for 2nd Q: How are you feeling today?
  function HowAreYou(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const animeChoices = ['1', 'a', 'anime', 'anime🎌', 'a. Anime🎌'];
    const romcomChoices = ['2', 'b', 'romantic comedy', 'romantic comedy❤️', 'b. romantic comedy❤️'];
    const sitcomChoices = ['3', 'c', 'sitcom', 'c. sitcom', 'c. sitcom😂'];
    const westernChoices = ['4', 'd', 'western', 'western🤠', 'd. western🤠'];

    if (animeChoices.includes(query)) {
      scores.anime += 2;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy += 2;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom += 2;
    } else {
      scores.western += 2;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``); // Error if there is no agent.add()
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for 3rd Q: What sounds good about right now?
  function SoundsGood(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const animeChoices = ['1', 'a', 'awesome', 'a. awesome'];
    const romcomChoices = ['2', 'b', 'mysterious', 'b. mysterious'];
    const sitcomChoices = ['3', 'c', 'stressed', 'c. stressed'];
    const westernChoices = ['4', 'd', 'chillin', 'd. chillin'];

    if (animeChoices.includes(query)) {
      scores.anime++;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy++;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom++;
    } else {
      scores.western++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for 4th Q: Choose a location
  function ChooseLocation(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const animeWesternChoices = ['2', 'b', 'salty', 'b. salty'];
    const romcomSitcomChoices = ['1', 'a', 'sweet', 'a. sweet'];

    if (animeWesternChoices.includes(query)) {
      scores.anime++;
      scores.western++;
    } else {
      scores.romanticcomedy++;
      scores.sitcom++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for 5th Q: How's your brain feeling right now?
  function BrainFeeling(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const animeChoices = ['1', 'a', 'stay at home', 'a. stay at home'];
    const romcomWesternChoices = ['2', 'b', 'castle', 'b. castle'];
    const sitcomChoices = ['3', 'c', 'forest', 'c. forest'];

    if (animeChoices.includes(query)) {
      scores.anime++;
    } else if (romcomWesternChoices.includes(query)) {
      scores.romanticcomedy++;
      scores.western++;
    } else {
      scores.sitcom++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for 6th Q: What would you rather do?
  function RatherDo(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const animeChoices = ['1', 'a', 'need simulation', 'a. need simulation'];
    const sitcomChoices = ['2', 'b', 'dont want to think', 'b. dont want to think'];
    const romcomChoices = ['3', 'c', 'need distraction', 'c. need distraction'];
    const westernChoices = ['4', 'd', 'need to feel something', 'd. need to feel something'];

    if (animeChoices.includes(query)) {
      scores.anime++;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy++;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom++;
    } else {
      scores.western++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for 7th Q: What type of music sets your mood?
  function TypeOfMusic(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const westernChoices = ['1', 'a', 'parachuting', 'a. parachuting'];
    const romcomChoices = ['2', 'b', 'restaurant', 'b. restaurant'];
    const sitcomChoices = ['3', 'c', 'escape room', 'c. escape room'];
    const animeChoices = ['4', 'd', 'long walk', 'd. long walk'];

    if (animeChoices.includes(query)) {
      scores.anime++;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy++;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom++;
    } else {
      scores.western++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for 8th Q: What's your go-to snack during a movie?
  function GoToSnack(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const animeChoices = ['1', 'a', 'epic beats', 'a. epic beats'];
    const sitcomChoices = ['2', 'b', 'romantic pop', 'b. romantic pop'];
    const romcomChoices = ['3', 'c', 'classics', 'c. classics'];
    const westernChoices = ['4', 'd', 'country', 'd. country'];

    if (animeChoices.includes(query)) {
      scores.anime++;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy++;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom++;
    } else {
      scores.western++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });
}

  // Function for recommendation intent
  function GetRecommendation(agent) {
    const query = agent.query.toLowerCase();
    console.log("query: " + query);
    let spiel = '';
    let message = '';
    
    const context = GetContext(agent.contexts);
    const scores = LoadParameterValues(context);

    const westernChoices = ['1', 'a', 'popcorn', 'a. popcorn'];
    const romcomChoices = ['2', 'b', 'chocolate', 'b. chocolate'];
    const sitcomChoices = ['3', 'c', 'chips', 'c. chips'];
    const animeChoices = ['4', 'd', 'sushi', 'd. sushi'];

    if (animeChoices.includes(query)) {
      scores.anime++;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy++;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom++;
    } else {
      scores.western++;
    }

    const parameters = {
      "anime": scores.anime,
      "romantic comedy": scores.romanticcomedy,
      "sitcom": scores.sitcom,
      "western": scores.western
    };

    LogScores(spiel, scores);

  agent.setContext({ name: 'sessiondata', lifespan: 15, parameters: parameters });

      const genreScores = new Map([
      ["anime", scores.anime],
      ["romanticcomedy", scores.romanticcomedy],
      ["sitcom", scores.sitcom],
      ["western", scores.western]
    ]);

    const maxScore = Math.max(...Array.from(genreScores.values()));

    let selectedGenres = [];
    genreScores.forEach((score, genre) => {
      if (score === maxScore) {
          selectedGenres.push(genre);
      }
  });

    let recommendedGenre;
    if (selectedGenres.length >= 2) {
      const randomizer = Math.floor(Math.random() * selectedGenres.length);
      recommendedGenre = selectedGenres[randomizer];
    } else {
      recommendedGenre = selectedGenres[0];
    }

    console.log(selectedGenres);
    console.log(recommendedGenre);

    // Movie Choice Recommendations
    const animeMovies = ["Your Name 🌌", "Spirited Away 🐉", "Akira 🏍️", "My Neighbor Totoro 🌳", 
        "Princess Mononoke 🐺", "A Silent Voice 🎧", "Ghost in the Shell 🤖", "Howl's Moving Castle 🏰", 
        "Perfect Blue 🎥", "Paprika 🌈"];
    const romcomMovies = ["Crazy Rich Asians 💰", "10 Things I Hate About You 💌", "When Harry Met Sally 🗽", 
        "Notting Hill 📚", "The Proposal 💍", "Love Actually 🎄", "50 First Dates 🌺", 
        "Silver Linings Playbook 🏆", "Bridget Jones's Diary 📖", "To All the Boys I've Loved Before ✉️"];
    const sitcomMovies = ["The Grand Budapest Hotel 🏨", "Ferris Bueller's Day Off 🚗", "Clueless 🛍️", 
        "Dumb and Dumber 🧢", "The 40-Year-Old Virgin 🎮", "Mean Girls 🎀", "Napoleon Dynamite 🦙", 
        "Superbad 🍺", "Step Brothers 🛏️", "Anchorman: The Legend of Ron Burgundy 🎤"];
    const westernMovies = ["The Good, the Bad, and the Ugly 🔫", "Unforgiven 🤠", "Django Unchained 🔗", 
        "True Grit 🐎", "The Magnificent Seven 🤵‍♂️", "Once Upon a Time in the West 🚂", 
        "Tombstone ⚰️", "No Country for Old Men 💼", "3:10 to Yuma ⏰", "The Searchers 🔍"];
    
    // Get two unique movies
    function getMovies(movie) {
        let randomIndex1 = Math.floor(Math.random() * movie.length);
        let randomIndex2 = Math.floor(Math.random() * movie.length);

        while (randomIndex1 === randomIndex2) {
            randomIndex2 = Math.floor(Math.random() * movie.length);
        }

        return [movie[randomIndex1], movie[randomIndex2]];
    }

    // Get snack_type parameter
    const snackType = agent.parameters.snack_type;

    agent.add(`So, your go-to movie snack is ${snackType}! A solid choice!`);
    agent.add(`Based on your preferences, I recommend you to watch ${recommendedGenre} movies!`);

    let movieRecommendation;
    switch (recommendedGenre) {
      case 'anime':
        movieRecommendation = getMovies(animeMovies);
        agent.add('Great choice! Here are some popular anime movie recommendations:');
        agent.add(`${movieRecommendation[0]}`);
        agent.add(`${movieRecommendation[1]}`);
        break;
      case 'romanticcomedy':
        movieRecommendation = getMovies(romcomMovies);
        agent.add('Romantic comedies are always a fun watch! Check these out:');
        agent.add(`${movieRecommendation[0]}`);
        agent.add(`${movieRecommendation[1]}`);
        break;
      case 'sitcom':
        movieRecommendation = getMovies(sitcomMovies);
        agent.add('Sitcoms are perfect for a good laugh! Here are some great movies:');
        agent.add(`${movieRecommendation[0]}`);
        agent.add(`${movieRecommendation[1]}`);
        break;
      case 'western':
        movieRecommendation = getMovies(westernMovies);
        agent.add('Westerns are always thrilling! Here are some classics:');
        agent.add(`${movieRecommendation[0]}`);
        agent.add(`${movieRecommendation[1]}`);
        break;
    }
  
}


  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', Welcome);
  intentMap.set('00.0GetStarted', GetStarted);
  intentMap.set('02.HowAreYou', HowAreYou);
  intentMap.set('03.SoundsGood', SoundsGood);
  intentMap.set('04.ChooseLocation', ChooseLocation);
  intentMap.set('05.BrainFeeling', BrainFeeling);
  intentMap.set('06.RatherDo', RatherDo);
  intentMap.set('07.TypeOfMusic', TypeOfMusic);
  intentMap.set('08.GoToSnack', GoToSnack);
  intentMap.set('09.GetRecommendation', GetRecommendation);
  agent.handleRequest(intentMap);
});