module.exports = (app) => {
    const alertType = require("../controllers/alertType.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new AlertType
    router.post("/", [authenticate], alertType.create);
  
    // Retrieve all AlertTypes
    router.get("/", [authenticate], alertType.findAll);
  
    // Retrieve a single AlertType with id
    router.get("/:id", [authenticate], alertType.findOne);
  
    // Update an AlertType with id
    router.put("/:id", [authenticate], alertType.update);
  
    // Delete an AlertType with id
    router.delete("/:id", [authenticate], alertType.delete);
  
    app.use("/asset-t3/alert-types", router);
};