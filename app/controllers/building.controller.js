const db = require("../models");
const Building = db.building;

// Create and Save a new Building
exports.create = (req, res) => {
  // Validate request
  if (!req.body.abbreviation || !req.body.assetId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create a Building
  const building = {
    id: req.body.id,
    abbreviation: req.body.abbreviation,
    assetId: req.body.assetId,
  };

  // Save Building in the database
  Building.create(building)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the building.",
      });
    });
};

// Retrieve all Buildings from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  Building.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving buildings.",
      });
    });
};

// Find a single Building with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Building.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find building with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving building with id=" + id,
      });
    });
};

// Update a Building by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Building.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Building was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update building with id=${id}. Maybe building was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating building with id=" + id,
      });
    });
};

// Delete a Building with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Building.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Building was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete building with id=${id}. Maybe building was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete building with id=" + id,
      });
    });
};

// Delete all Buildings from the database.
exports.deleteAll = (req, res) => {
  Building.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} buildings were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all buildings.",
      });
    });
};
