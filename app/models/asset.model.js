module.exports = (sequelize, Sequelize) => {
    return sequelize.define("asset", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      acquisitionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      acquisitionPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dueDate: {
        type: Sequelize.DATE,
      },
      condition: {
        type: Sequelize.STRING(25),
        allowNull: false,
        defaultValue: "Good"
      }
    });
};