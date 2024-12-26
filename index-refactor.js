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

  // Function for 2nd Q: How are you feeling today?
  // ok
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
      // message = `I see you're into anime movies! Let's dive into the next question to explore your preferences further.`;
    } else if (romcomChoices.includes(query)) {
      scores.romanticcomedy += 2;
      // message = `I see you're into romcom movies! Let's dive into the next question to explore your preferences further.`;
    } else if (sitcomChoices.includes(query)) {
      scores.sitcom += 2;
      // message = `I see you're into sitcom movies! Let's dive into the next question to explore your preferences further.`;
    } else {
      scores.western += 2;
      // message = `I see you're into western movies! Let's dive into the next question to explore your preferences further.`;
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
  // ok
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
  // ok
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
  // ok
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
  // 
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

  // Function for recommendation intent
  // 
  function GetRecommendation(agent) {
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

    agent.add(`Based on your preferences, I recommend you to watch ${recommendedGenre} movies!`);
  
    switch (recommendedGenre) {
      case 'anime':
        agent.add('Great choice! Here are some popular anime movie recommendations:');
        agent.add('- Attack on Titan 🎥');
        agent.add('- Your Name 🌟');
        agent.add('- Spirited Away ✨');
        break;
      case 'romanticcomedy':
        agent.add('Romantic comedies are always a fun watch! Check out these:');
        agent.add('- Crazy, Stupid, Love ❤️');
        agent.add('- The Proposal 💍');
        agent.add('- 10 Things I Hate About You 🎭');
        break;
      case 'sitcom':
        agent.add('Sitcoms are perfect for a good laugh! Here are some great movies:');
        agent.add('- Friends 😂');
        agent.add('- The Office 🏢');
        agent.add('- How I Met Your Mother 🤣');
        break;
      case 'western':
        agent.add('Westerns are always thrilling! Here are some classics:');
        agent.add('- The Good, The Bad, and The Ugly 🤠');
        agent.add('- Django Unchained 🔫');
        agent.add('- True Grit 🐎');
        break;
    }
  
}
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('00.0GetStarted', GetStarted);
  intentMap.set('02.HowAreYou', HowAreYou);
  intentMap.set('03.SoundsGood', SoundsGood);
  intentMap.set('04.ChooseLocation', ChooseLocation);
  intentMap.set('05.BrainFeeling', BrainFeeling);
  intentMap.set('06.RatherDo', RatherDo);
  intentMap.set('07.GetRecommendation', GetRecommendation);
  agent.handleRequest(intentMap);
});
