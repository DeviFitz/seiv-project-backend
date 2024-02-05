module.exports = (app) => {
    const fieldList = require("../controllers/fieldList.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new FieldList
    router.post("/", [authenticate], fieldList.create);
  
    // Retrieve all FieldLists
    router.get("/", [authenticate], fieldList.findAll);
  
    // Retrieve a single FieldList with id
    router.get("/:id", [authenticate], fieldList.findOne);
  
    // Update a FieldList with id
    router.put("/:id", [authenticate], fieldList.update);
  
    // Delete a FieldList with id
    router.delete("/:id", [authenticate], fieldList.delete);
  
    app.use("/asset-t3/field-lists", router);
};