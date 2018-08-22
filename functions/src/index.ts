import * as functions from 'firebase-functions';
// import fetch from 'node-fetch';
// import * as cheerio from 'cheerio';

import {dialogflow, Button, Image, BasicCard, SimpleResponse} from 'actions-on-google';

const app = dialogflow({debug: true});

app.intent('bloodSeeker3 getLocation', async (conv:any, parameters) => {
    console.log(parameters, "All Params");
    
    conv.close(new SimpleResponse({
        text: `Donor found is this`,
        speech: `Here is listing of ${parameters.blood_group} Donors in ${parameters.indian_states} area`

    }));

    conv.close( new BasicCard({
        title: "Basic Card Donor List",
        image: new Image({
            url: `https://www.ed.youth4work.com/images/users/user-default-image-boy.png`,
            alt: `new Image`
        })
    }))
});

export const fulfillment = functions.https.onRequest(app);
