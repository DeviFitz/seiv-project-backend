module.exports = (sequelize, Sequelize) => {
  return sequelize.define("building", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    abbreviation: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["abbreviation"],
      },
    ],
  });

  // Foreign keys:
  // - assetId (non-nullable)
};