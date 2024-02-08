const db = require("../models");
const Session = db.session;
const User = db.user;

const authenticate = async (req, res, next) => {
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
        await Session.update({ token: null }, { where: { token: session.token } })
        .catch((err) => {
          console.log("Error deleting token from database!");
        });
    } while (session?.expirationDate <= Date.now() && --attempts > 0);

    if (session?.expirationDate > Date.now()) {
      req.requestingUser = (await User.findByPk(session.userId, { where: { blocked: false } }))?.get({ plain: true });
      if (!req.requestingUser) return res.status(401).send({
        message: "Unauthorized! User is blocked.",
      });

      next();
      return;
    }
    
    return res.status(401).send({
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

const hasPermission = async (req, res, next) => {
  // const user = (await User.findOne({
  //   attributes: ['id', 'groupExpiration'],
  //   where: { id: req.requestingUser.id },
  //   include: [{
  //     model: db.group,
  //     as: "group",
  //     attributes: ['name'],
  //     // through: {
  //     //   attributes: ['name'],
  //     //   //where: {completed: true}
  //     // }
  //   }],
  // }))?.get({ plain: true });

  // Get user's permissions
  next();
};

// Load up object to export
const auth = {
  authenticate,
  hasPermission,
};

module.exports = auth;
