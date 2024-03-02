const db = require("../models");
const Room = db.room;

// Create and Save a new Room
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.buildingId) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create a Room
  const room = {
    id: req.body.id,
    name: req.body.name,
    buildingId: req.body.buildingId,
  };
  
  const type = await db.building.findByPk(room.buildingId, {
    attributes: [],
    include: {
      model: db.asset,
      as: "asset",
      attributes: [],
      required: true,
      include: {
        model: db.assetType,
        as: "type",
        attributes: [],
        where: { categoryId: req.requestingUser.dataValues.creatableCategories },
        required: true,
      },
    },
  });

  if (!type) return res.status(400).send({
    message: "Error creating building! Maybe user is not authorized.",
  });

  // Save Room in the database
  Room.create(room)
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the room.",
    });
  });
};

// Retrieve all Rooms from the database.
exports.findAll = (req, res) => {
  Room.findAll({
    ...req.paginator,
  })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving rooms.",
    });
  });
};

// Find a single Room with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Room.findByPk(id)
  .then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find room with id=${id}.`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error retrieving room with id=" + id,
    });
  });
};

// Update a Room by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Room.update(req.body, {
    where: { id },
    include: {
      model: db.building,
      as: "building",
      attributes: [],
      required: true,
      include: {
        model: db.asset,
        as: "asset",
        attributes: [],
        required: true,
        include: {
          model: db.assetType,
          as: "type",
          attributes: [],
          where: { categoryId: req.requestingUser.dataValues.editableCategories },
          required: true,
        },
      },
    },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Room was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update room with id=${id}. Maybe room was not found, req.body is empty, or user is not authorized!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error updating room with id=" + id,
    });
  });
};

// Delete a Room with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const type = await Room.findByPk(id, {
    attributes: [],
    include: {
      model: db.building,
      as: "building",
      attributes: [],
      required: true,
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
    },
  });

  if (!type) return res.status(404).send({
    message: "Error deleting room! Maybe room was not found or user is not authorized.",
  });

  Room.destroy({
    where: { id },
  })
  .then((num) => {
    if (num > 0) {
      res.send({
        message: "Room was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete room with id=${id}. Maybe room was not found!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Could not delete room with id=" + id,
    });
  });
};

// Delete all Rooms from the database.
// exports.deleteAll = (req, res) => {
//   Room.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} rooms were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all rooms.",
//     });
//   });
// };
