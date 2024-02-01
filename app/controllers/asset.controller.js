const db = require("../models");
const Asset = db.asset;

// Create and Save a new Asset
exports.create = (req, res) => {
  // Validate request
  if (!req.body.acquisitionDate || !req.body.acquisitionPrice || !req.body.condition || !req.body.typeId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an Asset
  const asset = {
    id: req.body.id,
    acquisitionDate: req.body.acquisitionDate,
    acquisitionPrice: req.body.acquisitionPrice,
    dueDate: req.body.dueDate,
    condition: req.body.condition,
    templateId: req.body.templateId,
    typeId: req.body.typeId,
    borrowerId: req.body.borrowerId,
    locationId: req.body.locationId,
  };

  // Save Asset in the database
  Asset.create(asset)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the asset.",
      });
    });
};

// Retrieve all Assets from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  Asset.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving assets.",
      });
    });
};

// Find a single Asset with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Asset.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find asset with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving asset with id=" + id,
      });
    });
};

// Update an Asset by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Asset.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Asset was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update asset with id=${id}. Maybe asset was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating asset with id=" + id,
      });
    });
};

// Delete an Asset with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Asset.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Asset was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete asset with id=${id}. Maybe asset was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete asset with id=" + id,
      });
    });
};

// Delete all Assets from the database.
exports.deleteAll = (req, res) => {
  Asset.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} assets were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all assets.",
      });
    });
};
