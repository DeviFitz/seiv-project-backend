const db = require("../models");
const Room = db.room;

// Create and Save a new Room
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create a Room
  const room = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
  };

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
  const id = req.query.id;

  Room.findAll({ where: {} })
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
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Room was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update room with id=${id}. Maybe room was not found or req.body is empty!`,
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
exports.delete = (req, res) => {
  const id = req.params.id;

  Room.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
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
exports.deleteAll = (req, res) => {
  Room.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} rooms were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all rooms.",
      });
    });
};
