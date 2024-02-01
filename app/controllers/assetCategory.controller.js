const db = require("../models");
const AssetCategory = db.assetCategory;

// Create and Save a new AssetCategory
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an AssetCategory
  const assetCategory = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
  };

  // Save AssetCategory in the database
  AssetCategory.create(assetCategory)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the asset category.",
      });
    });
};

// Retrieve all AssetCategorys from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  AssetCategory.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving asset categories.",
      });
    });
};

// Find a single AssetCategory with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssetCategory.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find asset category with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving asset category with id=" + id,
      });
    });
};

// Update an AssetCategory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AssetCategory.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Asset category was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update asset category with id=${id}. Maybe asset category was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating asset category with id=" + id,
      });
    });
};

// Delete an AssetCategory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AssetCategory.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "AssetCategory was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete asset category with id=${id}. Maybe asset category was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete asset category with id=" + id,
      });
    });
};

// Delete all AssetCategorys from the database.
exports.deleteAll = (req, res) => {
  AssetCategory.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} asset categories were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all asset categories.",
      });
    });
};
