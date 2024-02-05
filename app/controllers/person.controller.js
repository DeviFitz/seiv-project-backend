const db = require("../models");
const Person = db.person;

// Create and Save a new Person
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName || !req.body.lName || !req.body.email) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }

  // Create a Person
  const person = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
  };

  // Save Person in the database
  Person.create(person)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the person.",
      });
    });
};

// Retrieve all People from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;

  Person.findAll({ where: {} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving people.",
      });
    });
};

// Find a single Person with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Person.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find person with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving person with id=" + id,
      });
    });
};

// Update a Person by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Person.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Person was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update person with id=${id}. Maybe person was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating person with id=" + id,
      });
    });
};

// Delete a Person with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Person.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Person was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete person with id=${id}. Maybe person was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete person with id=" + id,
      });
    });
};
