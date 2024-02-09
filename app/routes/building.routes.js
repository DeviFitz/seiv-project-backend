module.exports = (app) => {
    const building = require("../controllers/building.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new Building
    router.post("/", [authenticate], building.create);
  
    // Retrieve all Buildings
    router.get("/", [authenticate], building.findAll);
  
    // Retrieve a single Building with id
    router.get("/:id", [authenticate], building.findOne);
  
    // Update a Building with id
    router.put("/:id", [authenticate], building.update);
  
    // Delete a Building with id
    router.delete("/:id", [authenticate], building.delete);
  
    app.use("/asset-t3/buildings", router);
};