const { OpenAI } = require('openai');
const { addDeal, hotelContacto, getDeal, empresaRecibo } = require('../helpers/index')

const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY
});

const main = async (req, res) => {

    try {
        const { hotel, url, empresa } = req.body
        console.log(hotel, empresa)
        const prom = empresaRecibo(empresa)
        console.log(prom)
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text", text: `${prom}`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                "url": `${url}`,
                            },
                        },
                    ],
                },
            ],
        });
        const jsonData = response.choices[0].message.content
        const jsonString = JSON.parse(jsonData.match(/{[^]*}/)?.[0]);

        // console.log(response.choices[0].message.content);
        console.log(jsonString)
        const hotelID = await hotelContacto(hotel)
        await addDeal(hotelID, jsonString, url)

        res.json({
            msg: jsonString
        })

    } catch (error) {
        console.log(error)
    }

    // res.status(200).end();
}

module.exports = {
    main
}