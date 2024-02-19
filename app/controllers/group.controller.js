const db = require("../models");
const Group = db.group;

// Create and Save a new Group
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: "Content cannot be empty!",
    });
  }
  else if (!!req.body.priority && req.body.priority <= 0)
  {
    return res.status(400).send({
      message: "Cannot create a group of priority 0 or less as it is reserved for super users.",
    });
  };

  // Create an Group
  const group = {
    id: req.body.id,
    name: req.body.name,
    priority: req.body.priority,
  };

  // Save Group in the database
  Group.create(group)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the group.",
      });
    });
};

// Retrieve all Groups from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  Group.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving groups.",
      });
    });
};

// Find a single Group with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Group.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find group with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving group with id=" + id,
      });
    });
};

// Update a Group by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Group.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Group was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update group with id=${id}. Maybe group was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating group with id=" + id,
      });
    });
};

// Delete a Group with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Group.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Group was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete group with id=${id}. Maybe group was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete group with id=" + id,
      });
    });
};

// Delete all Groups from the database.
exports.deleteAll = (req, res) => {
  Group.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} groups were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all groups.",
      });
    });
};
