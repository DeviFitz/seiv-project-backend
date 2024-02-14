module.exports = (app) => {
    const assetTemplate = require("../controllers/assetTemplate.controller.js");
    const {
        authenticate,
        getPermissions,
        getCreatableCategories,
        getEditableCategories,
        getViewableCategories,
    } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new AssetTemplate
    router.post("/", [authenticate, getPermissions, getCreatableCategories /*Template Create+*/], assetTemplate.create);
  
    // Retrieve all AssetTemplates
    router.get("/", [authenticate, getPermissions, getViewableCategories /*Template View+*/], assetTemplate.findAll);
  
    // Retrieve a single AssetTemplate with id
    router.get("/:id", [authenticate, getPermissions, getViewableCategories /*Template View+*/], assetTemplate.findOne);
  
    // Update an AssetTemplate with id
    router.put("/:id", [authenticate, getPermissions, getEditableCategories /*Template Edit+*/], assetTemplate.update);
  
    // Delete an AssetTemplate with id
    router.delete("/:id", [authenticate, getPermissions, getEditableCategories /*Template Delete+*/], assetTemplate.delete);
  
    app.use("/asset-t3/asset-templates", router);
};