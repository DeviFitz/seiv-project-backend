module.exports = (app) => {
    const assetField = require("../controllers/assetField.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new AssetField
    router.post("/", [authenticate], assetField.create);
  
    // Retrieve all AssetFields
    router.get("/", [authenticate], assetField.findAll);
  
    // Retrieve a single AssetField with id
    router.get("/:id", [authenticate], assetField.findOne);
  
    // Update an AssetField with id
    router.put("/:id", [authenticate], assetField.update);
  
    // Delete an AssetField with id
    router.delete("/:id", [authenticate], assetField.delete);
  
    app.use("/asset-t3/asset-fields", router);
};