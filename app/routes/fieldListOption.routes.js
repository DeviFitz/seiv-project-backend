module.exports = (app) => {
    const fieldListOption = require("../controllers/fieldListOption.controller.js");
    const {
        authenticate,
        getPermissions,
        getCreatableCategories,
        getEditableCategories,
        getViewableCategories,
        getDeletableCategories,
    } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new FieldListOption
    router.post("/", [authenticate, getPermissions, getCreatableCategories /*Type Create+*/], fieldListOption.create);
  
    // Retrieve all FieldListOptions
    router.get("/", [authenticate, getPermissions, getViewableCategories], fieldListOption.findAll);
  
    // Retrieve a single FieldListOption with id
    router.get("/:id", [authenticate, getPermissions, getViewableCategories], fieldListOption.findOne);
  
    // Update a FieldListOption with id
    router.put("/:id", [authenticate, getPermissions, getEditableCategories /*Type Edit+*/], fieldListOption.update);
  
    // Delete a FieldListOption with id
    router.delete("/:id", [authenticate, getPermissions, getDeletableCategories /*Type Delete+*/], fieldListOption.delete);
  
    app.use("/asset-t3/field-list-options", router);
};