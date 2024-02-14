const db = require("../models");
const Session = db.session;
const User = db.user;

/**Determines whether the user has a valid session and is not blocked*/
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
      session = (await Session.findOne({
        where: { token: authHeader.slice(7) },
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      }))?.dataValues;

      // Erase the token in the database if either the token has expired or if the user has been blocked
      if (session?.expirationDate <= Date.now() || !!session?.user?.dataValues?.blocked) {
        await Session.update({ token: null }, { where: { token: session.token } })
        .catch((err) => {
          console.log("Error deleting token from database!");
        });

        // If the user has been blocked
        if (!!session?.user?.dataValues?.blocked) return res.status(401).send({
          message: "Unauthorized! User is blocked.",
        });
      }
    } while (session?.expirationDate <= Date.now() && --attempts > 0);

    if (session?.expirationDate > Date.now()) {
      req.requestingUser = session.user;
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

/**Gets the user's permissions and attaches them to req.requestingUser*/
const getPermissions = async (req, res, next) => {
  const userGroup = await db.group.findByPk(req.requestingUser.dataValues.groupId);
  
  // Get user's permissions
  const permissions = new Set([
    ...(await req.requestingUser.getPermissions()),
    ...((await userGroup?.getPermissions()) ?? [])
  ]);

  req.requestingUser.dataValues.permissions = [...permissions.values()];
  next();
};



//#region Under Categories
/**Gets the ids of categories that the user has permission to view under*/
const getViewableCategories = async (req, res, next) => {
  req.requestingUser.dataValues.viewableCategories = new Set(req.requestingUser.dataValues.permissions
  .filter(permission => !!permission.categoryId && permission.name.match(/View/i)?.length > 0)
  .map(permission => permission.categoryId));

  if (req.requestingUser.dataValues.viewableCategories.size > 0) next();
  else res.status(401).send({
    message: "Unauthorized! User does not have permission to view data under any categories.",
  });
};

/**Gets the ids of categories that the user has permission to edit under*/
const getEditableCategories = async (req, res, next) => {
  req.requestingUser.dataValues.editableCategories = new Set(req.requestingUser.dataValues.permissions
  .filter(permission => !!permission.categoryId && permission.name.match(/Edit/i)?.length > 0)
  .map(permission => permission.categoryId));

  if (req.requestingUser.dataValues.editableCategories.size > 0) next();
  else res.status(401).send({
    message: "Unauthorized! User does not have permission to edit data under any categories.",
  });
};

/**Gets the ids of categories that the user has permission to create under*/
const getCreatableCategories = async (req, res, next) => {
  req.requestingUser.dataValues.creatableCategories = new Set(req.requestingUser.dataValues.permissions
  .filter(permission => !!permission.categoryId && permission.name.match(/Create/i)?.length > 0)
  .map(permission => permission.categoryId));

  if (req.requestingUser.dataValues.creatableCategories.size > 0) next();
  else res.status(401).send({
    message: "Unauthorized! User does not have permission to create data under any categories.",
  });
};

/**Gets the ids of categories that the user has permission to delete under*/
const getDeletableCategories = async (req, res, next) => {
  req.requestingUser.dataValues.deletableCategories = new Set(req.requestingUser.dataValues.permissions
  .filter(permission => !!permission.categoryId && permission.name.match(/Delete/i)?.length > 0)
  .map(permission => permission.categoryId));

  if (req.requestingUser.dataValues.deletableCategories.size > 0) next();
  else res.status(401).send({
    message: "Unauthorized! User does not have permission to delete data under any categories.",
  });
};
//#endregion

// Load up object to export
module.exports = {
  authenticate,
  getPermissions,
  getViewableCategories,
  getEditableCategories,
  getCreatableCategories,
  getDeletableCategories,
};
