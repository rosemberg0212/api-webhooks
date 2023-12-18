const apiSMS = async (telefono, cuerpo) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    client.messages
    .create({
        body: `${cuerpo}`,
        from: "+16293006240",
        to: "+573015687156",
    })
    .then((message) => console.log(message.sid));
};

module.exports = {
    apiSMS
}
