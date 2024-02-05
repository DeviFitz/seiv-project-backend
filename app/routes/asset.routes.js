module.exports = (app) => {
    const asset = require("../controllers/asset.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new Asset
    router.post("/", [authenticate], asset.create);
  
    // Retrieve all Assets
    router.get("/", [authenticate], asset.findAll);
  
    // Retrieve a single Asset with id
    router.get("/:id", [authenticate], asset.findOne);
  
    // Update an Asset with id
    router.put("/:id", [authenticate], asset.update);
  
    // Delete an Asset with id
    router.delete("/:id", [authenticate], asset.delete);
  
    app.use("/asset-t3/assets", router);
};