
const { Sequelize, DataTypes, Model, Deferrable } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {
  getFullName() {
    return [this.salutation, this.firstName, this.lastName].join(' ');
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  salutation: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  firstName: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  lastName: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  gender: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  dob: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  mobile: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  mobileVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  localAddress: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  landmark: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  pinCode: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null
  },
}, {
  timestamps: true,
  freezeTableName: true,
  sequelize,
  modelName: 'User'
});

module.exports = {
  User: User
};