const db = require("../models");
const AssetField = db.assetField;

// Create and Save a new AssetField
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an AssetField
  const assetField = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
  };

  // Save AssetField in the database
  AssetField.create(assetField)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the asset field.",
      });
    });
};

// Retrieve all AssetFields from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  AssetField.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving asset fields.",
      });
    });
};

// Find a single AssetField with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssetField.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find asset field with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving asset field with id=" + id,
      });
    });
};

// Update an AssetField by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AssetField.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Asset field was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update asset field with id=${id}. Maybe asset field was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating asset field with id=" + id,
      });
    });
};

// Delete an AssetField with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AssetField.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Asset field was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete asset field with id=${id}. Maybe asset field was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete asset field with id=" + id,
      });
    });
};

// Delete all AssetFields from the database.
exports.deleteAll = (req, res) => {
  AssetField.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} asset fields were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all asset fields.",
      });
    });
};
