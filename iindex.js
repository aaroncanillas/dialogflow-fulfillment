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

  // Function for 2nd Q: How are you feeling today?
  // Scoring system implementation
  // Done. Working
  function HowAreYou(agent) {
    const query = agent.query.toLowerCase();
    const contexts = agent.contexts;
    console.log("query: " + query);

    const context = contexts.filter(context => {
      console.log("debug flag: " + context.name);
      return context.name === 'sessiondata';
    });

    let anime = parseInt(context[0].parameters.anime);
    let romanticcomedy = parseInt(context[0].parameters.romanticcomedy);
    let sitcom = parseInt(context[0].parameters.sitcom);
    let western = parseInt(context[0].parameters.western);
    let spiel = '';

    switch (query) {
      case '1':
      case 'a':
      case 'anime':
      case 'anime🎌':
      case 'a. Anime🎌':
        anime++;
        spiel = 'anime';
        break;
      case '2':
      case 'b':
      case 'romantic comedy':
      case 'romantic comedy❤️':
      case 'b. romantic comedy❤️':
        romanticcomedy++;
        spiel = 'romantic comedy';
        break;
      case '3':
      case 'c':
      case 'sitcom':
      case 'c. sitcom':
      case 'c. sitcom😂':
        sitcom++;
        spiel = 'sitcom';
        break;
      case '4':
      case 'd':
      case 'western':
      case 'western🤠':
      case 'd. western🤠':
        western++;
        spiel = 'western';
        break;
    }

    const parameters = {
      "anime": anime,
      "romantic comedy": romanticcomedy,
      "sitcom": sitcom,
      "western": western
    };

    console.log("spiel " +  spiel);
    console.log("anime: " + anime);
    console.log("romantic comedy: " + romanticcomedy);
    console.log("sitcom: " + sitcom);
    console.log("western: " + western);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 10, parameters: parameters });
}

  // Function for 3rd Q: What sounds good about right now?
  //
  function SoundsGood(agent) {
    const query = agent.query.toLowerCase();
    const contexts = agent.contexts;
    console.log("query: " + query);

    const context = contexts.filter(context => {
      console.log("debug flag: " + context.name);
      return context.name === 'sessiondata';
    });

    let anime = parseInt(context[0].parameters.anime);
    let romanticcomedy = parseInt(context[0].parameters.romanticcomedy);
    let sitcom = parseInt(context[0].parameters.sitcom);
    let western = parseInt(context[0].parameters.western);
    let spiel = '';

    switch (query) {
      case '1':
      case 'a':
      case 'awesome':
      case 'a. awesome':
        anime++;
        spiel = 'anime';
        break;
      case '2':
      case 'b':
      case 'mysterious':
      case 'b. mysterious':
        romanticcomedy++;
        spiel = 'romantic comedy';
        break;
      case '3':
      case 'c':
      case 'stressed':
      case 'c. stressed':
        sitcom++;
        spiel = 'sitcom';
        break;
      case '4':
      case 'd':
      case 'chillin':
      case 'd. chillin':
        western++;
        spiel = 'western';
        break;
    }

    const parameters = {
      "anime": anime,
      "romantic comedy": romanticcomedy,
      "sitcom": sitcom,
      "western": western
    };

    console.log("spiel " +  spiel);
    console.log("anime: " + anime);
    console.log("romantic comedy: " + romanticcomedy);
    console.log("sitcom: " + sitcom);
    console.log("western: " + western);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 10, parameters: parameters });
}

  // Function for 4th Q: Choose a location
  //
  function ChooseLocation(agent) {
    const query = agent.query.toLowerCase();
    const contexts = agent.contexts;
    console.log("query: " + query);

    const context = contexts.filter(context => {
      console.log("debug flag: " + context.name);
      return context.name === 'sessiondata';
    });

    let anime = parseInt(context[0].parameters.anime);
    let romanticcomedy = parseInt(context[0].parameters.romanticcomedy);
    let sitcom = parseInt(context[0].parameters.sitcom);
    let western = parseInt(context[0].parameters.western);
    let spiel = '';

    switch (query) {
      case '1':
      case 'a':
      case 'sweet':
      case 'a. sweet':
        romanticcomedy++;
        sitcom++;
        spiel = 'romantic comedy and sitcom';
        break;
      case '2':
      case 'b':
      case 'salty':
      case 'b. salty':
        romanticcomedy++;
        anime++;
        western++;
        spiel = 'anime and western';
        break;
    }

    const parameters = {
      "anime": anime,
      "romantic comedy": romanticcomedy,
      "sitcom": sitcom,
      "western": western
    };

    console.log("spiel " +  spiel);
    console.log("anime: " + anime);
    console.log("romantic comedy: " + romanticcomedy);
    console.log("sitcom: " + sitcom);
    console.log("western: " + western);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 10, parameters: parameters });
}

  // Function for 5th Q: How's your brain feeling right now?
  // 
  function BrainFeeling(agent) {
    const query = agent.query.toLowerCase();
    const contexts = agent.contexts;
    console.log("query: " + query);

    const context = contexts.filter(context => {
      console.log("debug flag: " + context.name);
      return context.name === 'sessiondata';
    });

    let anime = parseInt(context[0].parameters.anime);
    let romanticcomedy = parseInt(context[0].parameters.romanticcomedy);
    let sitcom = parseInt(context[0].parameters.sitcom);
    let western = parseInt(context[0].parameters.western);
    let spiel = '';

    switch (query) {
      case '1':
      case 'a':
      case 'stay at home':
      case 'a. stay at home':
        anime++;
        spiel = 'anime';
        break;
      case '2':
      case 'b':
      case 'castle':
      case 'b. castle':
        romanticcomedy++;
        western++;
        spiel = 'romantic comedy and western';
        break;
      case '3':
      case 'c':
      case 'forest':
      case 'c. forest':
        sitcom++;
        spiel = 'sitcom';
        break;
    }

    const parameters = {
      "anime": anime,
      "romantic comedy": romanticcomedy,
      "sitcom": sitcom,
      "western": western
    };

    console.log("spiel " +  spiel);
    console.log("anime: " + anime);
    console.log("romantic comedy: " + romanticcomedy);
    console.log("sitcom: " + sitcom);
    console.log("western: " + western);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 10, parameters: parameters });
}

  // Function for 6th Q: What would you rather do?
  // 
  function RatherDo(agent) {
    const query = agent.query.toLowerCase();
    const contexts = agent.contexts;
    console.log("query: " + query);

    const context = contexts.filter(context => {
      console.log("debug flag: " + context.name);
      return context.name === 'sessiondata';
    });

    let anime = parseInt(context[0].parameters.anime);
    let romanticcomedy = parseInt(context[0].parameters.romanticcomedy);
    let sitcom = parseInt(context[0].parameters.sitcom);
    let western = parseInt(context[0].parameters.western);
    let spiel = '';

    switch (query) {
      case '1':
      case 'a':
      case 'need simulation':
      case 'a. need simulation':
        anime++;
        spiel = 'anime';
        break;
      case '2':
      case 'b':
      case 'dont want to think':
      case 'b. dont want to think':
        sitcom++;
        spiel = 'sitcom';
        break;
      case '3':
      case 'c':
      case 'need distraction':
      case 'c. need distraction':
        romanticcomedy++;
        spiel = 'romanticcomedy';
        break;
      case '4':
      case 'd':
      case 'need to feel something':
      case 'd. need to feel something':
        western++;
        spiel = 'western';
        break;
    }

    const parameters = {
      "anime": anime,
      "romantic comedy": romanticcomedy,
      "sitcom": sitcom,
      "western": western
    };

    console.log("spiel " +  spiel);
    console.log("anime: " + anime);
    console.log("romantic comedy: " + romanticcomedy);
    console.log("sitcom: " + sitcom);
    console.log("western: " + western);

  agent.add(``);
  agent.setContext({ name: 'sessiondata', lifespan: 10, parameters: parameters });

}


    // Input the recommended movie's here, using the fulfillment recommend based on the highest scoring category

    // Hint: store the points in an array and get the biggest point using Math.Max()


  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('00.0GetStarted', GetStarted);
  intentMap.set('02.HowAreYou', HowAreYou);
  intentMap.set('03.SoundsGood', SoundsGood);
  intentMap.set('04.ChooseLocation', ChooseLocation);
  intentMap.set('05.BrainFeeling', BrainFeeling);
  intentMap.set('06.RatherDo', RatherDo);
  agent.handleRequest(intentMap);
});
