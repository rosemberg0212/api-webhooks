const infoRyver = async (req, res) => {
  const challenge = req.body.challenge;
  res.send({ challenge });
  const {data} = req.body;
  try {
    console.log(data.channel.__metadata);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  infoRyver,
};
