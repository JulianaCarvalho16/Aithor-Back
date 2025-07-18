const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  style: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "fofo",
  },
});

module.exports = User;
