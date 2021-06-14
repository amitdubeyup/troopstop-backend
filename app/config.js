const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });
const { Sequelize } = require('sequelize');
const DB = new Sequelize('troopstop', 'troopstop', 'troopstop', {
    host: 'troop-stop.cipskr3q59sq.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql'
});
const S3 = new AWS.S3({
  accessKeyId: 'AKIATWF3VOVMERWWLQT4',
  secretAccessKey: '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',
});

module.exports = {
  S3: S3,
  DB: DB,
  serverSecret: '$2y$12$4A2phQdjCl9fFvcuTHpn3.l7mZTBNagz4HrApfnY1tJYcyHgalifK',
  tokenExpire: '30d',
  google_api_key: 'AIzaSyCJnen-AB1eM6aoGKKLSnA1cyDIQknzD5Q',
};