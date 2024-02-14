module.exports = (app) => {
    const templateData = require("../controllers/templateData.controller.js");
    const {
        authenticate,
        getPermissions,
        getCreatableCategories,
        getEditableCategories,
        getViewableCategories,
        getDeletableCategories,
    } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new TemplateData
    router.post("/", [authenticate, getPermissions, getCreatableCategories /*Template Edit+*/], templateData.create);
  
    // Retrieve all TemplateDatas
    router.get("/", [authenticate, getPermissions, getViewableCategories], templateData.findAll);
  
    // Retrieve a single TemplateData with id
    router.get("/:id", [authenticate, getPermissions, getViewableCategories], templateData.findOne);
  
    // Update a TemplateData with id
    router.put("/:id", [authenticate, getPermissions, getEditableCategories /*Template Edit+*/], templateData.update);
  
    // Delete a TemplateData with id
    router.delete("/:id", [authenticate, getPermissions, getDeletableCategories /*Template Edit+*/], templateData.delete);
  
    app.use("/asset-t3/template-data", router);
};