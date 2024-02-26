const db = require("../models");
const AssetField = db.assetField;

// Create and Save a new AssetField
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.label || !req.body.row || !req.body.rowSpan || !req.body.column || !req.body.columnSpan || !req.body.assetTypeId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an AssetField
  const assetField = {
    id: req.body.id,
    label: req.body.label,
    row: req.body.row,
    rowSpan: req.body.rowSpan,
    column: req.body.column,
    columnSpan: req.body.columnSpan,
    required: req.body.required,
    templateField: req.body.templateField,
    type: req.body.type,
    assetTypeId: req.body.assetTypeId,
    fieldListId: req.body.fieldListId,
  };

  const type = await db.assetType.findByPk(assetField.assetTypeId, {
    as: "assetType",
    attributes: [],
    where: { categoryId: req.requestingUser.dataValues.editableCategories },
    required: true,
  });

  if (!type) return res.status(400).send({
    message: "Error creating asset field! Maybe user is unauthorized.",
  });

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
  AssetField.findAll({
    include: {
      model: db.assetType,
      as: "assetType",
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
      message: err.message || "Some error occurred while retrieving asset fields.",
    });
  });
};

// Find a single AssetField with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssetField.findByPk(id, {
    include: {
      model: db.assetType,
      as: "assetType",
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
        message: `Cannot find asset field with id=${id}. Maybe user is unauthorized!`,
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
    where: { id },
    include: {
      model: db.assetType,
      as: "assetType",
      attributes: [],
      required: true,
      where: { categoryId: req.requestingUser.dataValues.editableCategories },
    },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset field was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update asset field with id=${id}. Maybe asset field was not found, req.body is empty, or user is unauthorized!`,
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
exports.delete = async (req, res) => {
  const id = req.params.id;
  const type = await AssetField.findByPk(id, {
    attributes: [],
    include: {
      model: db.assetType,
      as: "assetType",
      attributes: [],
      where: { categoryId: req.requestingUser.dataValues.deletableCategories },
      required: true,
      raw: true,
    },
  });

  if (!type) return res.status(404).send({
    message: "Error deleting asset field! Maybe asset field was not found or user is unauthorized.",
  });

  AssetField.destroy({ where: { id } })
  .then((num) => {
    if (num > 0) {
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
// exports.deleteAll = (req, res) => {
//   AssetField.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} asset fields were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all asset fields.",
//     });
//   });
// };
