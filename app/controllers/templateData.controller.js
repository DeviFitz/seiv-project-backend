const db = require("../models");
const TemplateData = db.templateData;

// Create and Save a new TemplateData
exports.create = (req, res) => {
  // Validate request
  if (!req.body.value || !req.body.templateId || !req.body.fieldId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create a TemplateData
  const templateData = {
    id: req.body.id,
    value: req.body.value,
    templateId: req.body.templateId,
    fieldId: req.body.fieldId,
  };

  // Save TemplateData in the database
  TemplateData.create(templateData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the template data.",
      });
    });
};

// Retrieve all TemplateDatas from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  TemplateData.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving template data.",
      });
    });
};

// Find a single TemplateData with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  TemplateData.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find template data with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving template data with id=" + id,
      });
    });
};

// Update a TemplateData by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  TemplateData.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Template data was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update template data with id=${id}. Maybe template data was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating template data with id=" + id,
      });
    });
};

// Delete a TemplateData with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  TemplateData.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Template data was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete templatedata with id=${id}. Maybe template data was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete template data with id=" + id,
      });
    });
};

// Delete all TemplateDatas from the database.
exports.deleteAll = (req, res) => {
  TemplateData.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} template data were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all template data.",
      });
    });
};
