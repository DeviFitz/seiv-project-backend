module.exports = (app) => {
    const notification = require("../controllers/notification.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new Notification
    router.post("/", [authenticate], notification.create);
  
    // Retrieve all Notifications
    router.get("/", [authenticate], notification.findAll);
  
    // Retrieve a single Notification with id
    router.get("/:id", [authenticate], notification.findOne);
  
    // Update a Notification with id
    router.put("/:id", [authenticate], notification.update);
  
    // Delete a Notification with id
    router.delete("/:id", [authenticate], notification.delete);
  
    app.use("/asset-t3/notifications", router);
};