module.exports = (app) => {
    const templateData = require("../controllers/templateData.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    const router = require("express").Router();
  
    // Create a new TemplateData
    router.post("/", [authenticate], templateData.create);
  
    // Retrieve all TemplateDatas
    router.get("/", [authenticate], templateData.findAll);
  
    // Retrieve a single TemplateData with id
    router.get("/:id", [authenticate], templateData.findOne);
  
    // Update a TemplateData with id
    router.put("/:id", [authenticate], templateData.update);
  
    // Delete a TemplateData with id
    router.delete("/:id", [authenticate], templateData.delete);
  
    app.use("/asset-t3/template-data", router);
};