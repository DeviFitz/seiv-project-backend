module.exports = (app) => {
    const fieldListOption = require("../controllers/fieldListOption.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new FieldListOption
    router.post("/", [authenticate], fieldListOption.create);
  
    // Retrieve all FieldListOptions
    router.get("/", [authenticate], fieldListOption.findAll);
  
    // Retrieve a single FieldListOption with id
    router.get("/:id", [authenticate], fieldListOption.findOne);
  
    // Update a FieldListOption with id
    router.put("/:id", [authenticate], fieldListOption.update);
  
    // Delete a FieldListOption with id
    router.delete("/:id", [authenticate], fieldListOption.delete);
  
    app.use("/asset-t3/field-list-options", router);
};