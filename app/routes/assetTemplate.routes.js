module.exports = (app) => {
    const assetTemplate = require("../controllers/assetTemplate.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new AssetTemplate
    router.post("/", [authenticate], assetTemplate.create);
  
    // Retrieve all AssetTemplates
    router.get("/", [authenticate], assetTemplate.findAll);
  
    // Retrieve a single AssetTemplate with id
    router.get("/:id", [authenticate], assetTemplate.findOne);
  
    // Update an AssetTemplate with id
    router.put("/:id", [authenticate], assetTemplate.update);
  
    // Delete an AssetTemplate with id
    router.delete("/:id", [authenticate], assetTemplate.delete);
  
    app.use("/asset-t3/asset-templates", router);
};