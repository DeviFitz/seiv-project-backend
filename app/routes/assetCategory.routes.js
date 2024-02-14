module.exports = (app) => {
    const assetCategory = require("../controllers/assetCategory.controller.js");
    const { authenticate, getPermissions } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new AssetCategory
    router.post("/", [authenticate, getPermissions /*Category Create+*/], assetCategory.create);
  
    // Retrieve all AssetCategories
    router.get("/", [authenticate], assetCategory.findAll);
  
    // Retrieve a single AssetCategory with id
    router.get("/:id", [authenticate], assetCategory.findOne);
  
    // Update an AssetCategory with id
    router.put("/:id", [authenticate, getPermissions /*Category Edit+*/], assetCategory.update);
  
    // Delete an AssetCategory with id
    router.delete("/:id", [authenticate, getPermissions /*Category Delete+*/], assetCategory.delete);
  
    app.use("/asset-t3/asset-categories", router);
};