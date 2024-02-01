const db = require("../models");
const Alert = db.alert;

// Create and Save a new Alert
exports.create = (req, res) => {
  // Validate request
  if (!req.body.date || !req.body.status || !req.body.typeId || !req.body.assetId)
  {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create an Alert
  const alert = {
    id: req.body.id,
    date: req.body.date,
    description: req.body.description,
    status: req.body.status,
    typeId: req.body.typeId,
    assetId: req.body.assetId,
  };

  // Save Alert in the database
  Alert.create(alert)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the alert.",
      });
    });
};

// Retrieve all Alerts from the database.
exports.findAll = (req, res) => {
  Alert.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving alerts.",
      });
    });
};

// Find a single Alert with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Alert.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find alert with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving alert with id=" + id,
      });
    });
};

// Update an Alert by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Alert.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Alert was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update alert with id=${id}. Maybe alert was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating alert with id=" + id,
      });
    });
};

// Delete an Alert with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Alert.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Alert was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete alert with id=${id}. Maybe alert was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete alert with id=" + id,
      });
    });
};

// Delete all Alerts from the database.
exports.deleteAll = (req, res) => {
  Alert.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} alerts were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all alerts.",
      });
    });
};
