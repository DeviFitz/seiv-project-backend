module.exports = (app) => {
    const alert = require("../controllers/alert.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new Alert
    router.post("/", [authenticate, /*Category Edit+*/], alert.create);
  
    // Retrieve all Alerts
    router.get("/", [authenticate, /*Category Read+*/], alert.findAll);
  
    // Retrieve a single Alert with id
    router.get("/:id", [authenticate, /*Category Read+*/], alert.findOne);
  
    // Update an Alert with id
    router.put("/:id", [authenticate, /*Category Edit+*/], alert.update);
  
    // Delete an Alert with id
    router.delete("/:id", [authenticate, /*Category Edit+*/], alert.delete);
  
    app.use("/asset-t3/alerts", router);
};