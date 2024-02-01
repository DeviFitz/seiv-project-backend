module.exports = (app) => {
    const assetData = require("../controllers/assetData.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new AssetData
    router.post("/", [authenticate], assetData.create);
  
    // Retrieve all AssetData
    router.get("/", [authenticate], assetData.findAll);
  
    // Retrieve a single AssetData with id
    router.get("/:id", [authenticate], assetData.findOne);
  
    // Update an AssetData with id
    router.put("/:id", [authenticate], assetData.update);
  
    // Delete an AssetData with id
    router.delete("/:id", [authenticate], assetData.delete);
  
    app.use("/asset-t3/asset-data", router);
};