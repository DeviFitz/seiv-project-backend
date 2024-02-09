module.exports = (app) => {
    const assetCategory = require("../controllers/assetCategory.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new AssetCategory
    router.post("/", [authenticate], assetCategory.create);
  
    // Retrieve all AssetCategories
    router.get("/", [authenticate], assetCategory.findAll);
  
    // Retrieve a single AssetCategory with id
    router.get("/:id", [authenticate], assetCategory.findOne);
  
    // Update an AssetCategory with id
    router.put("/:id", [authenticate], assetCategory.update);
  
    // Delete an AssetCategory with id
    router.delete("/:id", [authenticate], assetCategory.delete);
  
    app.use("/asset-t3/asset-categories", router);
};