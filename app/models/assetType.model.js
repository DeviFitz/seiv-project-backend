module.exports = (sequelize, Sequelize) => {
    return sequelize.define("assetType", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      circulatable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    });

    // Foreign keys:
    // - categoryId (non-nullable)
};