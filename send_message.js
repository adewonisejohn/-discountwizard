const accountSid = 'AC73fd9c36225c0c4cc904643688d2b0db';
const authToken = '6c4910ba57b6240d717ca86b33212005';

const client = require('twilio')(accountSid, authToken);

function send_message(message,send_to){

    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body:message,
            to: send_to
        })
        .then(message => console.log(message.sid));

}


module.exports = send_message
