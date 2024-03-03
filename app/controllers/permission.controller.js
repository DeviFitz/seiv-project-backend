const db = require("../models");
const Permission = db.permission;

// Create and Save a new Permission
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.name) {
//     res.status(400).send({
//       message: "Content cannot be empty!",
//     });
//     return;
//   }

//   // Create a Permission
//   const permission = {
//     id: req.body.id,
//     name: req.body.name,
//     description: req.body.description,
//   };

//   // Save Permission in the database
//   Permission.create(permission)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the permission.",
//       });
//     });
// };

// Retrieve all Permissions from the database.
exports.findAll = (req, res) => {
  Permission.findAll({
    ...req.paginator,
  })
  .then((data) => {
    res.send(data.map(permission => permission.get({ plain: true })));
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving permissions.",
    });
  });
};

// Find a single Permission with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Permission.findByPk(id)
  .then((data) => {
    if (!!data) {
      res.send(data.get({ plain: true }));
    } else {
      res.status(404).send({
        message: `Cannot find permission with id=${id}.`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error retrieving permission with id=" + id,
    });
  });
};

// Update a Permission by the id in the request
// exports.update = (req, res) => {
//   const id = req.params.id;

//   Permission.update(req.body, {
//     where: { id: id },
//   })
//   .then((num) => {
//     if (num == 1) {
//       res.send({
//         message: "Permission was updated successfully.",
//       });
//     } else {
//       res.send({
//         message: `Cannot update permission with id=${id}. Maybe permission was not found or req.body is empty!`,
//       });
//     }
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: "Error updating permission with id=" + id,
//     });
//   });
// };

// Delete a Permission with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Permission.destroy({
//     where: { id: id },
//   })
//   .then((num) => {
//     if (num == 1) {
//       res.send({
//         message: "Permission was deleted successfully!",
//       });
//     } else {
//       res.send({
//         message: `Cannot delete permission with id=${id}. Maybe permission was not found!`,
//       });
//     }
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: "Could not delete permission with id=" + id,
//     });
//   });
// };

// Delete all Permissions from the database.
// exports.deleteAll = (req, res) => {
//   Permission.destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((nums) => {
//     res.send({ message: `${nums} permissions were deleted successfully!` });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while removing all permissions.",
//     });
//   });
// };

exports.normalizePermissions = (obj) => {
  const normalize = (permissions) => {
    const normalizedPerms = [];
    permissions.forEach(permission => {
      if (!permission?.categoryId) return normalizedPerms.push({
        name: permission.name,
        clearance: "full",
        report: false,
      });

      const permissionTiers = {
        none: 0,
        view: 1, 
        edit: 2,
        create: 3,
        delete: 4,
      };

      const normalizedName = `${permission.name.match(/"[\s\S]*"/i)}`.replaceAll("\"", "");
      const permissionGroup = normalizedPerms.find(perm => perm.name == normalizedName);
      
      const report = permission.name.match(/report/i)?.length > 0;
      const clearance = report ? "none"
      : permission.name.match(/view/i)?.length > 0 ? "view"
      : permission.name.match(/edit/i)?.length > 0 ? "edit"
      : permission.name.match(/create/i)?.length > 0 ? "create"
      : permission.name.match(/delete/i)?.length > 0 ? "delete"
      : "none";
      
      if (!permissionGroup) return normalizedPerms.push({
        name: normalizedName,
        clearance,
        report,
      });

      if (permissionTiers[permissionGroup.clearance] < permissionTiers[clearance]) permissionGroup.clearance = clearance;
      if (report) permissionGroup.report = true;
    });
    return normalizedPerms.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
  };

  if (!obj || ((typeof obj) != "object")) return obj;

  if (obj?.permissions?.constructor === Array) obj.permissions = normalize(obj.permissions);
  
  Object.keys(obj).forEach(key => this.normalizePermissions(obj[key]));

  return obj;
};