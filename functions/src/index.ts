import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

const serviceAccount = require("../key/bb-doxxqy-firebase-adminsdk-ipsw1-9943fbc015.json");

import {dialogflow, BasicCard, SimpleResponse, List, Carousel} from 'actions-on-google';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bb-doxxqy.firebaseio.com"
});

const getSomethingPromize = admin.database().ref(`/donar_list/`).orderByChild('blood_group');


const app = dialogflow();
app.intent('bloodSeeker3 getLocation', async (conv:any, parameters) => {
    console.log("params", parameters);
    
    return getSomethingPromize.equalTo(parameters.blood_group)
            .once('value')
            .then((snapshot) => {

                if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
                    return conv.close('Sorry, try this on a screen device or select the ' +
                        'phone surface in the simulator.');
                
                }

                let myItems = {};
                const donorCount = snapshot.numChildren();
                let message = "";
                let singleRecord;

                switch (donorCount) {

                    case 0:
                        getSimpleResponse(conv, parameters);
                        break;

                    case 1:

                        singleRecord = snapshot.val();
                        
                        singleRecord =  singleRecord[Object.keys(singleRecord)[0]];
                        const is:any = parameters.indian_states;

                        if (singleRecord.state.toLowerCase() !== is.toLowerCase()){
                            getSimpleResponse(conv, parameters);
                            break;
                        }

                        message = `Details of ${parameters.blood_group} donors in ${parameters.indian_states} area`;
                        getSimpleResponse(conv, parameters, message);
                    
                        getBasicCard(conv, singleRecord);
                        break;
                
                    default:                        

                        snapshot.forEach(childSnapshot => {
                            
                            const entity = childSnapshot.val();
                            const state:any = parameters.indian_states;

                            if (entity.state.toLowerCase() !== state.toLowerCase()){                                
                                return;
                            }
        
                            myItems[entity.name] = {
                                synonyms: [
                                    entity.name,
                                ],
                                title: `  ${entity.name}  `,
                                description: ` Contact : ${entity.phone} ${entity.phone2}, ${entity.city}, ${entity.state}, ${entity.pincode}  `,
                                subtitle:`${parameters.blood_group}, ${parameters.indian_states}`
                            };

                            singleRecord = entity;
                            console.log("SR", singleRecord);
                        });
                        
                        let itemCount = Object.keys(myItems).length;

                        switch (itemCount) {
                            case 0:
                                message = `Sorry! No Donors having ${parameters.blood_group} found in ${parameters.indian_states} area`;
                                break;

                            case 1:
                                message = `Details of ${parameters.blood_group} donors in ${parameters.indian_states} area`;
                                getBasicCard(conv, singleRecord);
                                break;
                        
                            default:
                                message = `Details of ${parameters.blood_group} donors in ${parameters.indian_states} area`;

                                conv.ask(new List({
                                    title: `${parameters.blood_group} donors in ${parameters.indian_states}`,
                                    items: myItems,
                                }));
                        }
                }
                                
                
                return getSimpleResponse(conv, parameters, message);
            });
});

function getSimpleResponse(conv, parameters, message=null){
    let displayMessage = message;

    if (!message) {
        displayMessage = `Sorry! No Donors having ${parameters.blood_group} found in ${parameters.indian_states} area`;
    }
    return conv.close(new SimpleResponse({
        text: displayMessage,
        speech: displayMessage

    }));
}

function getBasicCard(conv, singleRecord){
    return conv.ask(new BasicCard({
        text: `${singleRecord.blood_group}, ${singleRecord.state}`,
        subtitle: `Contact : ${singleRecord.phone} ${singleRecord.phone2}, ${singleRecord.city}, ${singleRecord.state}, ${singleRecord.pincode}, ${singleRecord.comment}  `,
        title: `${singleRecord.name}`,
        display: 'CROPPED',
    }));
}
export const fulfillment = functions.https.onRequest(app);