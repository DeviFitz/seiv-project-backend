const db = require("../models");
const AssetTemplate = db.assetTemplate;

// Create and Save a new AssetTemplate
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.assetTypeId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an AssetTemplate
  const assetTemplate = {
    id: req.body.id,
    name: req.body.name,
    assetTypeId: req.body.assetTypeId,
  };

  const type = await db.assetType.findByPk(assetTemplate.assetTypeId, {
    as: "assetType",
    attributes: [],
    where: { categoryId: req.requestingUser.dataValues.creatableCategories },
    required: true,
  });

  if (!type) return res.status(400).send({
    message: "Error creating asset template! Maybe user is unauthorized.",
  });

  // Save AssetTemplate in the database
  AssetTemplate.create(assetTemplate)
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the asset template.",
    });
  });
};

// Retrieve all AssetTemplates from the database.
exports.findAll = (req, res) => {
  AssetTemplate.findAll({
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
        message: err.message || "Some error occurred while retrieving asset templates.",
      });
    });
};

// Find a single AssetTemplate with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssetTemplate.findByPk(id, {
    ...req.paginator,
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
        message: `Cannot find asset template with id=${id}. Maybe user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error retrieving asset template with id=" + id,
    });
  });
};

// Update an AssetTemplate by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AssetTemplate.update(req.body, {
    where: { id },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset template was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update asset template with id=${id}. Maybe asset template was not found or req.body is empty!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error updating asset template with id=" + id,
    });
  });
};

// Delete an AssetTemplate with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const type = await AssetTemplate.findByPk(id, {
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
    message: "Error deleting asset! Maybe asset template was not found or user is unauthorized.",
  });

  AssetTemplate.destroy({ where: { id } })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset template was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete asset template with id=${id}. Maybe asset template was not found!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Could not delete asset template with id=" + id,
    });
  });
};

// Delete all AssetTemplates from the database.
// exports.deleteAll = (req, res) => {
//   AssetTemplate.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} asset templates were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all asset templates.",
//     });
//   });
// };
