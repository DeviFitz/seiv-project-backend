const db = require("../models");
const AssetData = db.assetData;

// Create and Save a new AssetData
// exports.create = async (req, res) => {
//   // Validate request
//   if (!req.body.assetId || !req.body.fieldId) {
//     res.status(400).send({
//       message: "Content cannot be empty!",
//     });
//     return;
//   }

//   // Create an AssetData
//   const assetData = {
//     id: req.body.id,
//     value: req.body.value,
//     assetId: req.body.assetId,
//     fieldId: req.body.fieldId,
//   };

//   const type = await db.asset.findByPk(assetData.assetId, {
//     attributes: [],
//     include: {
//       model: db.assetType,
//       as: "type",
//       attributes: [],
//       where: { categoryId: req.requestingUser.dataValues.editableCategories },
//       required: true,
//     }
//   });

//   if (!type) return res.status(404).send({
//     message: "Error creating asset data! Maybe user is unauthorized.",
//   });

//   // Save AssetData in the database
//   AssetData.create(assetData)
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Some error occurred while creating the asset data.",
//     });
//   });
// };

// Retrieve all AssetData from the database.
exports.findAll = (req, res) => {
  AssetData.findAll({
    include: {
      model: db.asset,
      as: "asset",
      attributes: [],
      required: true,
      include: {
        model: db.assetType,
        as: "type",
        attributes: [],
        required: true,
        where: { categoryId: req.requestingUser.dataValues.viewableCategories },
      },
    },
  })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving asset data.",
    });
  });
};

// Find a single AssetData with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssetData.findByPk(id, {
    include: {
      model: db.asset,
      as: "asset",
      attributes: [],
      required: true,
      include: {
        model: db.assetType,
        as: "type",
        attributes: [],
        required: true,
        where: { categoryId: req.requestingUser.dataValues.viewableCategories },
      },
    },
  })
  .then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find assetdata with id=${id}. Maybe user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error retrieving assetdata with id=" + id,
    });
  });
};

// Update an AssetData by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AssetData.update(req.body, {
    where: { id },
    include: {
      model: db.asset,
      as: "asset",
      attributes: [],
      required: true,
      include: {
        model: db.assetType,
        as: "type",
        attributes: [],
        required: true,
        where: { categoryId: req.requestingUser.dataValues.editableCategories },
      },
    },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Asset data was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update asset data with id=${id}. Maybe asset data was not found, req.body is empty, or user is unauthorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error updating asset data with id=" + id,
    });
  });
};

// Delete an AssetData with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   AssetData.destroy({
//     where: { id: id },
//   })
//   .then((num) => {
//     if (num == 1) {
//       res.send({
//         message: "Asset data was deleted successfully!",
//       });
//     } else {
//       res.send({
//         message: `Cannot delete asset data with id=${id}. Maybe asset data was not found!`,
//       });
//     }
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: "Could not delete asset data with id=" + id,
//     });
//   });
// };

// Delete all AssetDatas from the database.
// exports.deleteAll = (req, res) => {
//   AssetData.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} asset data were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all asset data.",
//     });
//   });
// };
