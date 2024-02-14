module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const {
    authenticate,
    getPermissions,
  } = require("../authorization/authorization.js");
  const router = require("express").Router();

  // Create a new User
  router.post("/", [authenticate, getPermissions /*Get Requestor's Priority, User Create+*/], user.create);

  // Retrieve all People
  router.get("/", [authenticate, getPermissions /*User View+*/], user.findAll);

  // Retrieve a single User with id
  router.get("/:id", [authenticate, getPermissions /*User View+*/], user.findOne);

  // Update a User with id
  router.put("/:id", [authenticate, getPermissions /*Get Requestor's Priority, Block User, Change User Permissions*/], user.update);

  // Delete a User with id
  router.delete("/:id", [authenticate, getPermissions /*Get Requestor's Priority, User Remove+*/], user.delete);

  app.use("/asset-t3/users", router);
};
