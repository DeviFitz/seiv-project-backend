const db = require("../models");
const Asset = db.asset;

// Create and Save a new Asset
exports.create = async (req, res) => {
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

  const type = await db.assetType.findByPk(asset.typeId, {
    as: "type",
    attributes: [],
    where: { categoryId: req.requestingUser.dataValues.creatableCategories },
    required: true,
  });

  if (!type) return res.status(400).send({
    message: "Error creating asset! Maybe user is unauthorized.",
  });

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
  Asset.findAll({
    ...req.paginator,
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      required: true,
      where: { categoryId: req.requestingUser.dataValues.viewableCategories },
    },
  })
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

  Asset.findByPk(id, {
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      required: true,
      where: { categoryId: req.requestingUser.dataValues.viewableCategories },
    },
  })
  .then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find asset with id=${id}. Maybe asset was not found or user is unauthorized!`,
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
    where: { id },
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      required: true,
      where: { categoryId: req.requestingUser.dataValues.editableCategories },
    },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update asset with id=${id}. Maybe asset was not found, req.body is empty, or user is unauthorized!`,
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
exports.delete = async (req, res) => {
  const id = req.params.id;
  const type = await Asset.findByPk(id, {
    attributes: [],
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      where: { categoryId: req.requestingUser.dataValues.deletableCategories },
      required: true,
      raw: true,
    },
  });

  if (!type) return res.status(404).send({
    message: "Error deleting asset! Maybe asset was not found or user is unauthorized.",
  });

  Asset.destroy({ where: { id } })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete asset with id=${id}. Maybe asset was not found or user is unauthorized!`,
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
// exports.deleteAll = (req, res) => {
//   Asset.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} assets were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all assets.",
//     });
//   });
// };
