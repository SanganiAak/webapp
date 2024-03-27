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
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  verificationTokenExpiration: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'verification_token_expiration'
  },
  verificationClickCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'verification_click_count'
  },
  verificationToken: {
    type: Sequelize.UUID,
    allowNull: true,
    field: 'verification_token'
  },
  verificationEmailSent: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    field: 'verification_email_sent'
  }
}, {
  timestamps: false,
  tableName: 'users'
});

module.exports = User;
