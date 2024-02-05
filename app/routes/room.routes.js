module.exports = (app) => {
    const room = require("../controllers/room.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    let router = require("express").Router();
  
    // Create a new Room
    router.post("/", [authenticate], room.create);
  
    // Retrieve all Rooms
    router.get("/", [authenticate], room.findAll);
  
    // Retrieve a single Room with id
    router.get("/:id", [authenticate], room.findOne);
  
    // Update a Room with id
    router.put("/:id", [authenticate], room.update);
  
    // Delete a Room with id
    router.delete("/:id", [authenticate], room.delete);
  
    app.use("/asset-t3/rooms", router);
};