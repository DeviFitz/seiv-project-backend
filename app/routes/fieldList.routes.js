module.exports = (app) => {
    const fieldList = require("../controllers/fieldList.controller.js");
    const {
        authenticate,
        getPermissions,
        getCreatableCategories,
        getViewableCategories,
        getEditableCategories,
        getDeletableCategories,
    } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new FieldList
    router.post("/", [authenticate, getPermissions, getCreatableCategories /*Type Create+*/], fieldList.create);
  
    // Retrieve all FieldLists
    router.get("/", [authenticate, getPermissions, getViewableCategories], fieldList.findAll);
  
    // Retrieve a single FieldList with id
    router.get("/:id", [authenticate, getPermissions, getViewableCategories], fieldList.findOne);
  
    // Update a FieldList with id
    router.put("/:id", [authenticate, getPermissions, getEditableCategories /*Type Edit+*/], fieldList.update);
  
    // Delete a FieldList with id
    router.delete("/:id", [authenticate, getPermissions, getDeletableCategories /*Type Delete+*/], fieldList.delete);
  
    app.use("/asset-t3/field-lists", router);
};