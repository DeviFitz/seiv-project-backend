const db = require("../models");
const Building = db.building;

// Create and Save a new Building
exports.create = async (req, res) => {
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

  const type = await db.asset.findByPk(building.assetId, {
    attributes: [],
    include: {
      model: db.assetType,
      as: "type",
      attributes: [],
      where: { categoryId: req.requestingUser.dataValues.creatableCategories },
      required: true,
    }
  });

  if (!type) return res.status(400).send({
    message: "Error creating building! Maybe user is unauthorized.",
  });

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
  Building.findAll()
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
        message: "Building was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update building with id=${id}. Maybe building was not found, req.body is empty, or user is unauthorized!`,
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
exports.delete = async (req, res) => {
  const id = req.params.id;
  const type = await Building.findByPk(id, {
    attributes: [],
    include: {
      model: db.asset,
      as: "asset",
      attributes: [],
      raw: true,
      required: true,
      include: {
        model: db.assetType,
        as: "type",
        attributes: [],
        where: { categoryId: req.requestingUser.dataValues.deletableCategories },
        required: true,
        raw: true,
      },
    },
  });

  if (!type) return res.status(404).send({
    message: "Error deleting building! Maybe building was not found or user is unauthorized.",
  });

  Building.destroy({
    where: { id },
  })
  .then((num) => {
    if (num > 0) {
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
// exports.deleteAll = (req, res) => {
//   Building.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} buildings were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all buildings.",
//     });
//   });
// };
