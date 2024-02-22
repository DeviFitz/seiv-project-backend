const db = require("../models");
const AssetType = db.assetType;

// Create and Save a new AssetType
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.categoryId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an AssetType
  const assetType = {
    id: req.body.id,
    name: req.body.name,
    circulatable: req.body.circulatable,
    categoryId: req.body.categoryId,
  };

  if (!req.requestingUser.dataValues.creatableCategories.includes(assetType.categoryId)) return res.status(400).send({
    message: "Error creating asset template! Maybe user is unauthorized.",
  });

  // Save AssetType in the database
  AssetType.create(assetType)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the asset type.",
      });
    });
};

// Retrieve all AssetTypes from the database.
exports.findAll = (req, res) => {
  AssetType.findAll({
    where: { categoryId: req.requestingUser.dataValues.viewableCategories },
  })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving asset types.",
    });
  });
};

// Find a single AssetType with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssetType.findByPk(id, {
    where: { categoryId: req.requestingUser.dataValues.viewableCategories },
  })
  .then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find asset type with id=${id}. Maybe user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error retrieving asset type with id=" + id,
    });
  });
};

// Update an AssetType by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AssetType.update(req.body, {
    where: {
      id,
      categoryId: req.requestingUser.dataValues.editableCategories,
    },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset type was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update asset type with id=${id}. Maybe asset type was not found, req.body is empty, or user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error updating asset type with id=" + id,
    });
  });
};

// Delete an AssetType with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AssetType.destroy({
    where: {
      id,
      categoryId: req.requestingUser.dataValues.deletableCategories,
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Asset type was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete asset type with id=${id}. Maybe asset type was not found or user is unauthorized!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete asset type with id=" + id,
      });
    });
};

// Delete all AssetTypes from the database.
// exports.deleteAll = (req, res) => {
//   AssetType.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} asset types were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all asset types.",
//     });
//   });
// };
