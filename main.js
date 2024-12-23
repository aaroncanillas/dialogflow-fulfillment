// Sample Comment
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  
  // Alternate respond in opening intent, depending on selected response
  function GetStarted(agent) {
    const query = agent.query.toLowerCase();
    let spiel = null;

    if (query.includes('special')) {
      spiel = `Amazing! You're looking for something extraordinary! Let's get started then. 🎬`;
    } else {
      spiel = `Great choice! Let's find something awesome for you. 🍿`;
    }

    agent.add(spiel);
    agent.add(`What is your name?`);
  }


  // This is where the scoring system is implemented.
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
      case 'b':
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

// This is the second question of scoring implementation
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
      case 'sitcom':
      case 'c. stressed':
        sitcom++;
        spiel = 'sitcom';
        break;
      case '4':
      case 'b':
      case 'western':
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

//////////////////////////////////////////////////////////////////////



  
  function MovieRecommendation(agent) {
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

    // Input the recommended movie's here, using the fulfillment recommend based on the highest scoring category

    // Hint: store the points in an array and get the biggest point using Math.Max()




    agent.add(``);
    agent.add(
      new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true })
    );
  }
  

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('00.0GetStarted', GetStarted);
  intentMap.set('02.HowAreYou', HowAreYou);
  intentMap.set('03.SoundsGood', SoundsGood);
  intentMap.set('06.RatherDo', MovieRecommendation);
  agent.handleRequest(intentMap);
});