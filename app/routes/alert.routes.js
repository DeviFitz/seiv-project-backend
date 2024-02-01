module.exports = (app) => {
    const alert = require("../controllers/alert.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new Alert
    router.post("/", [authenticate], alert.create);
  
    // Retrieve all Alerts
    router.get("/", [authenticate], alert.findAll);
  
    // Retrieve a single Alert with id
    router.get("/:id", [authenticate], alert.findOne);
  
    // Update an Alert with id
    router.put("/:id", [authenticate], alert.update);
  
    // Delete an Alert with id
    router.delete("/:id", [authenticate], alert.delete);
  
    app.use("/asset-t3/alerts", router);
};