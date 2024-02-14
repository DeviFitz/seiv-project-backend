module.exports = (app) => {
    const assetField = require("../controllers/assetField.controller.js");
    const {
        authenticate,
        getPermissions,
        getEditableCategories,
        getViewableCategories,
        checkEditAssetType,
    } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new AssetField
    router.post("/", [authenticate, getPermissions, getEditableCategories, checkEditAssetType], assetField.create);
  
    // Retrieve all AssetFields
    router.get("/", [authenticate, getPermissions, getViewableCategories], assetField.findAll);
  
    // Retrieve a single AssetField with id
    router.get("/:id", [authenticate, getPermissions, getViewableCategories], assetField.findOne);
  
    // Update an AssetField with id
    router.put("/:id", [authenticate, getPermissions, getEditableCategories, checkEditAssetType], assetField.update);
  
    // Delete an AssetField with id
    router.delete("/:id", [authenticate, getPermissions, getEditableCategories, checkEditAssetType], assetField.delete);
  
    app.use("/asset-t3/asset-fields", router);
};