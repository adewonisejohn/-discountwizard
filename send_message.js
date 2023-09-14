const accountSid = 'your twilio account sid';
const authToken = 'your tiwlio auth token';

const client = require('twilio')(accountSid, authToken);

function send_message(message,send_to){

    client.messages
        .create({
            from: 'twilio whatsap number',
            body:message,
            to: send_to
        })
        .then(message => console.log(message.sid));

}


module.exports = send_message
