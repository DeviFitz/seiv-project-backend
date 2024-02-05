const db = require("../models");
const Session = db.session;
const Op = db.Sequelize.Op;

authenticate = async (req, res, next) => {
  const authHeader = req.get("authorization");

  // Make sure auth header is not null
  if (!authHeader) return res.status(401).send({
    message: "Unauthorized! No Auth Header.",
  });

  // Make sure that the auth header is the one we want to recognize
  if (authHeader.startsWith("Bearer ")) {
    const session = (await Session.findOne({ where: {
      token: authHeader.slice(7),
      expirationDate: { [Op.gt]: Date.now() }
    }}))?.dataValues

    if (!!session) next();
    else return res.status(401).send({
      message: "Unauthorized! Expired Token, Logout and Login again.",
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
