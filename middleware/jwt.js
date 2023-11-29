const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const validateToken = (req = request, res = response, next) => {
  const clientAccessToken = req.headers["access-client-id"];
  if (!clientAccessToken) return res.sendStatus(401);
  jwt.verify(clientAccessToken, process.env.ACCES_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

module.exports = {
  validateToken,
};
