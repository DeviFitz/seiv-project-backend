const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: dbConfig.logging,
});
const db = {
  Sequelize,
  sequelize,
};

//#region AddTables
db.alert = require("./alert.model.js")(sequelize, Sequelize);
db.alertType = require("./alertType.model.js")(sequelize, Sequelize);
db.asset = require("./asset.model.js")(sequelize, Sequelize);
db.assetCategory = require("./assetCategory.model.js")(sequelize, Sequelize);
db.assetData = require("./assetData.model.js")(sequelize, Sequelize);
db.assetField = require("./assetField.model.js")(sequelize, Sequelize);
db.assetTemplate = require("./assetTemplate.model.js")(sequelize, Sequelize);
db.assetType = require("./assetType.model.js")(sequelize, Sequelize);
db.building = require("./building.model.js")(sequelize, Sequelize);
db.fieldList = require("./fieldList.model.js")(sequelize, Sequelize);
db.fieldListOption = require("./fieldListOption.model.js")(sequelize, Sequelize);
db.group = require("./group.model.js")(sequelize, Sequelize);
db.log = require("./log.model.js")(sequelize, Sequelize);
db.notification = require("./notification.model.js")(sequelize, Sequelize);
db.permission = require("./permission.model.js")(sequelize, Sequelize);
db.person = require("./person.model.js")(sequelize, Sequelize);
db.room = require("./room.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.templateData = require("./templateData.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.vendor = require("./vendor.model.js")(sequelize, Sequelize);
//#endregion

//#region ForeignKeys
// Foreign keys for Alert
db.alert.belongsTo(
  db.alertType,
  { 
    as: "type",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true
  }
);
db.alert.belongsTo(
  db.asset,
  { 
    as: "asset",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true
  }
);

// Foreign keys for Alert Type
// None!

// Foreign keys for Asset
db.asset.belongsTo(
  db.assetTemplate,
  { 
    as: "template",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.asset.belongsTo(
  db.assetType,
  { 
    as: "type",
    foreignKey: { allowNull: false },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.asset.belongsTo(
  db.person,
  { 
    as: "borrower",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.asset.belongsTo(
  db.room,
  { 
    as: "location",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);

// Foreign keys for Asset Category
// None!

// Foreign keys for Asset Data
db.assetData.belongsTo(
  db.asset,
  { 
    as: "asset",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);
db.assetData.belongsTo(
  db.assetField,
  { 
    as: "field",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);

// Foreign keys for Asset Field
db.assetField.belongsTo(
  db.assetType,
  { 
    as: "assetType",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);
db.assetField.belongsTo(
  db.fieldList,
  { 
    as: "fieldList",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);

// Foreign keys for Asset Template
db.assetTemplate.belongsTo(
  db.assetType,
  { 
    as: "assetType",
    foreignKey: { allowNull: false },
    onDelete: "RESTRICT",
    hooks: true 
  }
);

// Foreign keys for Asset Type
db.assetType.belongsTo(
  db.assetCategory,
  { 
    as: "category",
    foreignKey: { allowNull: false },
    onDelete: "RESTRICT",
    hooks: true 
  }
);

// Foreign keys for Building
db.building.belongsTo(
  db.asset,
  { 
    as: "asset",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);

// Foreign keys for Field List
// None!

// Foreign keys for Field List Option
db.fieldListOption.belongsTo(
  db.fieldList,
  { 
    as: "list",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);

// Foreign keys for Group
db.group.belongsToMany(
  db.permission,
  { through: "groupPermission" }
);

// Foreign keys for Log
db.log.belongsTo(
  db.asset,
  { 
    as: "asset",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);
db.log.belongsTo(
  db.user,
  { 
    as: "author",
    foreignKey: { allowNull: false },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.log.belongsTo(
  db.person,
  { 
    as: "person",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.log.belongsTo(
  db.vendor,
  { 
    as: "vendor",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);

// Foreign keys for Notification
db.notification.belongsTo(
  db.user,
  { 
    as: "user",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true
  }
);

// Foreign keys for Permission
db.permission.belongsTo(
  db.assetCategory,
  {
    as: "category",
    foreignKey: { allowNull: true },
    onDelete: "CASCADE",
    hooks: true
  }
);

// Foreign keys for Person
db.person.hasMany(
  db.asset,
  {
    as: "borrowedAssets",
    foreignKey: "borrowerId",
  }
);

// Foreign keys for Room
db.room.belongsTo(
  db.building,
  { 
    as: "building",
    foreignKey: { allowNull: false },
    onDelete: "RESTRICT",
    hooks: true 
  }
);

// Foreign keys for Session
db.session.belongsTo(
  db.user,
  { 
    as: "user",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);

// Foreign keys for Template Data
db.templateData.belongsTo(
  db.assetTemplate,
  { 
    as: "template",
    foreignKey: { allowNull: false },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.templateData.belongsTo(
  db.assetField,
  { 
    as: "field",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);

// Foreign keys for User
db.user.belongsTo(
  db.group,
  { 
    as: "group",
    foreignKey: { allowNull: true },
    onDelete: "RESTRICT",
    hooks: true 
  }
);
db.user.belongsToMany(
  db.permission,
  { through: "userPermission" }
);
db.user.belongsTo(
  db.person,
  { 
    as: "person",
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    hooks: true 
  }
);

// Foreign keys for Vendor
// None!
//#endregion

module.exports = db;
