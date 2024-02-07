const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id' 
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    field: 'email'
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'password'
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name'
  },
  accountCreated: {
    type: Sequelize.DATE,
    field: 'account_created',
    defaultValue: Sequelize.NOW
  },
  accountUpdated: {
    type: Sequelize.DATE,
    field: 'account_updated',
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  tableName: 'users'
});

module.exports = User;
