module.exports = (sequelize, Sequelize) => {
  return sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupExpiration: {
      type: Sequelize.DATE,
    },
  });

  // Foreign keys:
  // - groupId (nullable)
  // - personId (non-nullable)
};
