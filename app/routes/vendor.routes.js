module.exports = (app) => {
    const vendor = require("../controllers/vendor.controller.js");
    const {
        authenticate,
        getPermissions,
    } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new Vendor
    router.post("/", [authenticate, getPermissions /*Vendor Create+*/], vendor.create);
  
    // Retrieve all Vendors
    router.get("/", [authenticate], vendor.findAll);
  
    // Retrieve a single Vendor with id
    router.get("/:id", [authenticate], vendor.findOne);
  
    // Update a Vendor with id
    router.put("/:id", [authenticate, getPermissions /*Vendor Edit+*/], vendor.update);
  
    // Delete a Vendor with id
    router.delete("/:id", [authenticate, getPermissions /*Vendor Delete+*/], vendor.delete);
  
    app.use("/asset-t3/vendors", router);
};