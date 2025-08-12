const OpenAI = require("openai");
const { enviarEmailGlobal } = require("../helpers");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const agenteSimple = async (req, res) => {
  const {...body} = req.body

  res.json({
    body
  })
};

module.exports = { agenteSimple };
