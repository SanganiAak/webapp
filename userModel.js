const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
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
    field: 'first_name',
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name',
    allowNull: false
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
