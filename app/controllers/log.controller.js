const db = require("../models");
const Log = db.log;

// Create and Save a new Log
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an Log
  const log = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
  };

  // Save Log in the database
  Log.create(log)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the log.",
      });
    });
};

// Retrieve all Logs from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  Log.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving logs.",
      });
    });
};

// Find a single Log with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Log.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find log with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving log with id=" + id,
      });
    });
};

// Update a Log by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Log.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Log was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update log with id=${id}. Maybe log was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating log with id=" + id,
      });
    });
};

// Delete a Log with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Log.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Log was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete log with id=${id}. Maybe log was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete log with id=" + id,
      });
    });
};

// Delete all Logs from the database.
exports.deleteAll = (req, res) => {
  Log.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} logs were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all logs.",
      });
    });
};
