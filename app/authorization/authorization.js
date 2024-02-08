const db = require("../models");
const Session = db.session;

authenticate = async (req, res, next) => {
  const authHeader = req.get("authorization");

  // Make sure auth header is not null
  if (!authHeader) return res.status(401).send({
    message: "Unauthorized! No Auth Header.",
  });

  // Make sure that the auth header is the one we want to recognize
  if (authHeader.startsWith("Bearer ")) {
    let session = {};
    let attempts = 10;
    do {
      session = (await Session.findOne({ where: {
        token: authHeader.slice(7)
      }}))?.dataValues

      if (session?.expirationDate <= Date.now())
        await Session.update({ ...session, token: ""}, { where: { token: session.token } })
        .catch((err) => {
          console.log("Error deleting token from database!");
        });
    } while (session?.expirationDate <= Date.now() && --attempts > 0);

    if (session?.expirationDate <= Date.now()) next();
    else return res.status(401).send({
      message: "Unauthorized! Expired Token; Log out and log in again.",
    });
  }
  else
  {
    return res.status(401).send({
      message: "Unauthorized! Invalid authorization header."
    })
  }
};

// Load up object to export
const auth = {
  authenticate,
};

module.exports = auth;
