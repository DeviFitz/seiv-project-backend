module.exports = (app) => {
    const log = require("../controllers/log.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new Log
    router.post("/", [authenticate], log.create);
  
    // Retrieve all Logs
    router.get("/", [authenticate], log.findAll);
  
    // Retrieve a single Log with id
    router.get("/:id", [authenticate], log.findOne);
  
    // Update a Log with id
    router.put("/:id", [authenticate], log.update);
  
    // Delete a Log with id
    router.delete("/:id", [authenticate], log.delete);
  
    app.use("/asset-t3/logs", router);
};